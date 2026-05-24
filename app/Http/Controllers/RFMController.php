<?php

namespace App\Http\Controllers;

use App\Models\RFM;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class RFMController extends BaseController
{
    public function __construct()
    {
        $this->model = RFM::class;
        parent::__construct();
    }

   public function procesar()
    {
        RFM::truncate();
        
        // Definimos la fecha específica: 14 de Abril de 2026
        $fechaReferencia = \Carbon\Carbon::parse('2026-04-14');

        // 1. Unificamos transacciones reales de productos y procedimientos
        $actividadDetalle = DB::table('cliente as c')
            ->join('mascota as m', 'c.id_cliente', '=', 'm.id_cliente')
            ->join('historia as h', 'm.id_mascota', '=', 'h.id_mascota')
            ->join('historia_procedimiento as hp', 'h.id_historia', '=', 'hp.id_historia')
            ->select('c.id_cliente', 'hp.fecha', 'hp.precio')
            ->unionAll(
                DB::table('cliente as c')
                    ->join('mascota as m', 'c.id_cliente', '=', 'm.id_cliente')
                    ->join('historia as h', 'm.id_mascota', '=', 'h.id_mascota')
                    ->join('historia_producto as hpr', 'h.id_historia', '=', 'hpr.id_historia')
                    ->select('c.id_cliente', 'hpr.fecha', 'hpr.precio')
            );

        // 2. Agrupamos para obtener métricas base
        // Nota: Pasamos la fecha formateada a la consulta SQL
        $fechaStr = $fechaReferencia->format('Y-m-d H:i:s');

        $resultados = DB::table(DB::raw("({$actividadDetalle->toSql()}) as sub"))
            ->mergeBindings($actividadDetalle)
            ->select(
                'id_cliente',
                DB::raw('COUNT(DISTINCT fecha) as f'),
                DB::raw('SUM(precio) as m'),
                DB::raw("DATEDIFF('$fechaStr', MAX(fecha)) as r"),
                DB::raw("DATEDIFF('$fechaStr', MIN(fecha)) as a"),
                DB::raw("MAX(fecha) as ultima_v"),
                DB::raw("MIN(fecha) as primera_v")
            )
            ->groupBy('id_cliente')
            ->get();

        // 3. Procesamos e insertamos
        foreach ($resultados as $item) {
            $segmentoStr = 'INACTIVO';
            if ($item->r <= 45) {
                $segmentoStr = 'ACTIVO';
            } elseif ($item->r <= 90) {
                $segmentoStr = 'EN RIESGO';
            }

            RFM::create([
                'id_cliente'        => $item->id_cliente,
                'fecha_calculo'     => $fechaReferencia->format('Y-m-d'), // Guardamos la fecha de corte usada
                'recencia'          => $item->r,
                'frecuencia'        => $item->f,
                'valor_monetario'   => $item->m,
                'antiguedad'        => $item->a,
                'ticket_promedio'   => $item->f > 0 ? ($item->m / $item->f) : 0,
                'intervalo_visitas' => $item->f > 1 ? (($item->a - $item->r) / ($item->f - 1)) : 0,
                'segmento'          => $segmentoStr,
                'creater_id'        => auth()->id() ?? 1,
                'primera_visita'    => $item->primera_v,
                'ultima_visita'     => $item->ultima_v,
            ]);
        }

        return back()->with('success', 'Análisis RFM completado con fecha de corte: ' . $fechaReferencia->format('d-m-Y'));
    }
    public function predecir(Request $request)
{
    // 1. Obtenemos los datos actuales de la tabla rfm
    $clientes = DB::table('rfm')->select('id_cliente', 'recencia', 'frecuencia', 'valor_monetario', 'antiguedad')->get();

    if ($clientes->isEmpty()) {
        return response()->json(['error' => 'No hay datos rfm'], 404);
    }

    // 2. Preparamos el envío a Python
    $payload = $clientes->map(function ($item) {
        return [
            'id_cliente'      => $item->id_cliente,
            'recencia'        => (float)$item->recencia,
            'frecuencia'      => (float)$item->frecuencia,
            'valor_monetario' => (float)$item->valor_monetario,
            'antiguedad'      => (float)$item->antiguedad,
        ];
    })->toArray();

    try {
        // 3. Petición al servidor Flask
        $response = Http::timeout(120)->post('http://127.0.0.1:5000/predict_rfm', $payload);

        if ($response->successful()) {
            $resultadosIA = $response->json()['predicciones'];

            // 4. ACTUALIZACIÓN MASIVA EN BASE DE DATOS
            // Usamos una transacción para asegurar que se guarden todos o ninguno
            DB::transaction(function () use ($resultadosIA) {
                foreach ($resultadosIA as $res) {
                    DB::table('rfm')
                        ->where('id_cliente', $res['id_cliente'])
                        ->update([
                            'recencia_p'        => $res['recencia_p'],
                            'frecuencia_p'      => $res['frecuencia_p'],
                            'valor_monetario_p' => $res['valor_monetario_p'],
                            // Fijamos la fecha proyectada al 31 de Dic de 2026 como en Python
                            'fecha_proyectada'  => '2026-07-31',
                            'updated_at'        => now()
                        ]);
                }
            });

            return response()->json([
                'success' => true, 
                'mensaje' => 'Base de Datos actualizada con proyecciones al 2026-12-31'
            ]);
        }
        
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error de conexión: ' . $e->getMessage()], 500);
    }
}
}