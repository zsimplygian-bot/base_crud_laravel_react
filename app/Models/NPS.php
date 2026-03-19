<?php
namespace App\Models;
use Illuminate\Support\Facades\DB;

class NPS extends BaseModel {
    protected $table = 'nps';

    protected static $tableColumns = [
        ['ID', 'id'],
        ['CLIENTE', 'cliente'],
        ['PROMOTORES', 'promotores'],
        ['DETRACTORES', 'detractores'],
        ['TOTAL', 'total'],
        ['NPS (%)', 'nps'],
    ];
    public static function getQuery(): array {
    $t1 = 'cliente';
    $t2 = 'mascota';
    $t3 = 'historia';
    $t4 = 'historia_valoracion';

    $query = DB::table($t1)
        ->join($t2, "$t1.id_$t1", '=', "$t2.id_$t1") // cliente → mascota
        ->join($t3, "$t2.id_$t2", '=', "$t3.id_$t2") // mascota → historia
        ->join($t4, "$t3.id_$t3", '=', "$t4.id_$t3") // historia → valoracion
        ->select([
            "$t1.id_$t1 as id",
            "$t1.cliente",

            DB::raw("SUM(CASE WHEN $t4.score >= 9 THEN 1 ELSE 0 END) as promotores"), // Conteo promotores
            DB::raw("SUM(CASE WHEN $t4.score <= 6 THEN 1 ELSE 0 END) as detractores"), // Conteo detractores
            DB::raw("COUNT($t4.score) as total"), // Total respuestas

            DB::raw("ROUND(
                (
                    SUM(CASE WHEN $t4.score >= 9 THEN 1 ELSE 0 END) -
                    SUM(CASE WHEN $t4.score <= 6 THEN 1 ELSE 0 END)
                ) * 100.0 / NULLIF(COUNT($t4.score),0)
            ,2) as nps"), // NPS %
        ])
        ->groupBy("$t1.id_$t1", "$t1.cliente");

    return ['alias' => $t1, 'query' => $query];
}
}