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
    
    // Usamos CURDATE() directamente en la consulta SQL para mayor precisión
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

    $resultados = DB::table(DB::raw("({$actividadDetalle->toSql()}) as sub"))
        ->mergeBindings($actividadDetalle)
        ->select(
            'id_cliente',
            DB::raw('COUNT(DISTINCT fecha) as f'),
            DB::raw('SUM(precio) as m'),
            // Calculamos contra la fecha actual de MySQL (CURDATE)
            DB::raw("DATEDIFF(CURDATE(), MAX(DATE(fecha))) as r"),
            DB::raw("DATEDIFF(CURDATE(), MIN(DATE(fecha))) as a"),
            DB::raw("MAX(fecha) as ultima_v"),
            DB::raw("MIN(fecha) as primera_v")
        )
        ->groupBy('id_cliente')
        ->get();

    foreach ($resultados as $item) {
        // Aseguramos que la recencia no sea negativa por errores de datos
        $recencia = max(0, $item->r);
        
        $segmentoStr = 'INACTIVO';
        if ($recencia <= 45) { $segmentoStr = 'ACTIVO'; } 
        elseif ($recencia <= 90) { $segmentoStr = 'EN RIESGO'; }

        RFM::create([
            'id_cliente'        => $item->id_cliente,
            'fecha_calculo'     => date('Y-m-d'),
            'recencia'          => $recencia,
            'frecuencia'        => $item->f,
            'valor_monetario'   => $item->m,
            'antiguedad'        => max(0, $item->a),
            'ticket_promedio'   => $item->f > 0 ? ($item->m / $item->f) : 0,
            'intervalo_visitas' => $item->f > 1 ? (($item->a - $recencia) / ($item->f - 1)) : 0,
            'segmento'          => $segmentoStr,
            'creater_id'        => auth()->id() ?? 1,
            'primera_visita'    => $item->primera_v,
            'ultima_visita'     => $item->ultima_v,
            'recencia_p'        => 0, 'frecuencia_p' => 0, 'valor_monetario_p' => 0,
        ]);
    }

    return back()->with('success', 'Análisis RFM actualizado exitosamente.');
}

public function procesarIndividual($id_rfm)
{
    $rfmRecord = RFM::find($id_rfm);
    if (!$rfmRecord) return response()->json(['error' => 'No encontrado'], 404);
    
    $id_cliente = $rfmRecord->id_cliente;

    $procedimientos = DB::table('historia_procedimiento as hp')
        ->join('historia as h', 'hp.id_historia', '=', 'h.id_historia')
        ->join('mascota as m', 'h.id_mascota', '=', 'm.id_mascota')
        ->where('m.id_cliente', $id_cliente)
        ->select('m.id_cliente', 'hp.fecha', 'hp.precio');

    $productos = DB::table('historia_producto as hpr')
        ->join('historia as h', 'hpr.id_historia', '=', 'h.id_historia')
        ->join('mascota as m', 'h.id_mascota', '=', 'm.id_mascota')
        ->where('m.id_cliente', $id_cliente)
        ->select('m.id_cliente', 'hpr.fecha', 'hpr.precio');

    $actividadDetalle = $procedimientos->unionAll($productos);

    $resultado = DB::table(DB::raw("({$actividadDetalle->toSql()}) as sub"))
        ->mergeBindings($actividadDetalle)
        ->select(
            'id_cliente',
            DB::raw('COUNT(DISTINCT fecha) as f'),
            DB::raw('SUM(precio) as m'),
            DB::raw("DATEDIFF(CURDATE(), MAX(DATE(fecha))) as r"),
            DB::raw("DATEDIFF(CURDATE(), MIN(DATE(fecha))) as a"),
            DB::raw("MAX(fecha) as ultima_v"),
            DB::raw("MIN(fecha) as primera_v")
        )
        ->groupBy('id_cliente')
        ->first();

    if (!$resultado) return response()->json(['error' => 'Sin transacciones'], 404);

    $recencia = max(0, $resultado->r);
    $segmentoStr = ($recencia <= 45) ? 'ACTIVO' : (($recencia <= 90) ? 'EN RIESGO' : 'INACTIVO');

    $rfmRecord->update([
        'fecha_calculo'     => date('Y-m-d'),
        'recencia'          => $recencia,
        'frecuencia'        => $resultado->f,
        'valor_monetario'   => $resultado->m,
        'antiguedad'        => max(0, $resultado->a),
        'segmento'          => $segmentoStr,
        'ultima_visita'     => $resultado->ultima_v,
        'primera_visita'    => $resultado->primera_v,
    ]);

    return response()->json(['success' => true]);
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