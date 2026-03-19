<?php
namespace App\Models;
use Illuminate\Support\Facades\DB;

class Churn extends BaseModel {
    protected $table = 'churn';

    protected static $tableColumns = [
        ['ID', 'id'],
        ['CLIENTE', 'cliente'],
        ['ULTIMA ATENCION', 'ultima_fecha'],
        ['MESES INACTIVO', 'meses_inactivo'],
        ['ESTADO', 'estado'],
        ['CHURN', 'churn'],
    ];

    public static function getQuery(): array {
        $t1 = 'cliente';
        $t2 = 'mascota';
        $t3 = 'historia';

        $interval = 2; // Meses para considerar baja

        $query = DB::table($t1)
            ->leftJoin($t2, "$t1.id_$t1", '=', "$t2.id_$t1") // cliente → mascota
            ->leftJoin($t3, "$t2.id_$t2", '=', "$t3.id_$t2") // mascota → historia
            ->select([
                "$t1.id_$t1 as id",
                "$t1.cliente",

                DB::raw("MAX($t3.fecha) as ultima_fecha"), // Última atención

                DB::raw("TIMESTAMPDIFF(MONTH, MAX($t3.fecha), NOW()) as meses_inactivo"), // Meses sin actividad

                DB::raw("CASE 
                    WHEN MAX($t3.fecha) IS NULL THEN 'BAJA' 
                    WHEN TIMESTAMPDIFF(MONTH, MAX($t3.fecha), NOW()) >= $interval THEN 'BAJA'
                    ELSE 'ACTIVO'
                END as estado"), // Estado del cliente

                DB::raw("CASE 
                    WHEN MAX($t3.fecha) IS NULL THEN 1
                    WHEN TIMESTAMPDIFF(MONTH, MAX($t3.fecha), NOW()) >= $interval THEN 1
                    ELSE 0 
                END as churn"), // 1 = churn
            ])
            ->groupBy("$t1.id_$t1", "$t1.cliente");

        return ['alias' => $t1, 'query' => $query];
    }
}