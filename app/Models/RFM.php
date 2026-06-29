<?php
namespace App\Models;

use Illuminate\Support\Facades\DB;

class RFM extends BaseModel {
    protected $table = 'rfm';

    protected static $validationRules = [
        'id_cliente'        => 'required|integer',
        'fecha_calculo'     => 'required|date',
        'recencia'          => 'required|numeric',
        'frecuencia'        => 'required|numeric',
        'valor_monetario'   => 'required|numeric',
        'antiguedad'        => 'required|integer',
        'ticket_promedio'   => 'required|numeric',
        'intervalo_visitas' => 'required|numeric',
        'segmento'          => 'required|string',
        'creater_id'        => 'required|integer',
        'primera_visita'    => 'nullable|date',
        'ultima_visita'     => 'nullable|date',
    ];

    protected static $tableColumns = [
        ['ID', 'id'],
        ['ID2', 'id_cliente'],
        ['CLIENTE', 'cliente'],
        ['SEGMENTO', 'estado_cliente'],
        ['RECENCIA', 'recencia'],
        ['N° ATENCIONES', 'frecuencia'],
        ['MONETARIO TOTAL', 'valor_monetario'],
        ['TICKET PROMEDIO', 'ticket_promedio'],
        ['INT. VISITAS', 'intervalo_visitas'],
        ['ANTIGÜEDAD (DÍAS)', 'antiguedad'],
        ['ÚLTIMA VISITA', 'ultima_visita'],
        ['PRIMERA VISITA', 'primera_visita'],
        ['RECENCIA PROYECTADA', 'recencia_p'],
        ['FRECUENCIA PROYECTADA', 'frecuencia_p'],
        ['VALOR MONETARIO PROYECTADO', 'valor_monetario_p'],
        ['FECHA PROYECTADA', 'fecha_proyectada'],
    ];

    public static function getQuery(): array {
        $t1 = 'rfm';
        $t2 = 'cliente';

        $query = DB::table($t1)
            ->join($t2, "$t1.id_cliente", '=', "$t2.id_$t2")
            ->select([
                "$t1.id_rfm as id", 
                "$t1.id_cliente",
                "$t2.cliente",
                "$t1.segmento as estado_cliente",
                "$t1.frecuencia",
                "$t1.valor_monetario",
                "$t1.ticket_promedio",
                "$t1.intervalo_visitas",
                "$t1.antiguedad",
                "$t1.ultima_visita",
                "$t1.primera_visita",
                "$t1.recencia",
                "$t1.recencia_p",
                "$t1.frecuencia_p",
                "$t1.valor_monetario_p",
                "$t1.fecha_calculo",
                "$t1.fecha_proyectada",
            ]);
            
        return ['alias' => $t1, 'query' => $query];
    }
}