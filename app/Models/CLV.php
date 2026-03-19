<?php
namespace App\Models;
use Illuminate\Support\Facades\DB;

class CLV extends BaseModel {
    protected $table = 'clv';

    protected static $tableColumns = [
        ['ID', 'id'],
        ['CLIENTE', 'cliente'],
        ['TOTAL INGRESOS', 'total_ingresos'],
        ['N° VISITAS', 'total_visitas'],
        ['CLV', 'clv'],
    ];

    public static function getQuery(): array {
        $t1 = 'cliente';
        $t2 = 'mascota';
        $t3 = 'historia';

        // Subquery: total procedimientos por historia
        $proc = DB::table('historia_procedimiento')
            ->select('id_historia', DB::raw('SUM(precio) as total_proc'))
            ->groupBy('id_historia');

        // Subquery: total productos por historia
        $prod = DB::table('historia_producto')
            ->select('id_historia', DB::raw('SUM(precio) as total_prod'))
            ->groupBy('id_historia');

        $query = DB::table($t1)
            ->join($t2, "$t1.id_$t1", '=', "$t2.id_$t1") // cliente → mascota
            ->join($t3, "$t2.id_$t2", '=', "$t3.id_$t2") // mascota → historia
            ->leftJoinSub($proc, 'hp', 'hp.id_historia', '=', "$t3.id_$t3") // Suma procedimientos
            ->leftJoinSub($prod, 'hpr', 'hpr.id_historia', '=', "$t3.id_$t3") // Suma productos
            ->select([
                "$t1.id_$t1 as id",
                "$t1.cliente",

                DB::raw("COUNT(DISTINCT $t3.id_$t3) as total_visitas"), // Visitas reales
                DB::raw("COALESCE(SUM(COALESCE(hp.total_proc,0) + COALESCE(hpr.total_prod,0)),0) as total_ingresos"), // Ingresos totales

                DB::raw("ROUND(
                    COALESCE(SUM(COALESCE(hp.total_proc,0) + COALESCE(hpr.total_prod,0)),0)
                    / NULLIF(COUNT(DISTINCT $t3.id_$t3),0)
                ,2) as clv"), // CLV promedio
            ])
            ->groupBy("$t1.id_$t1", "$t1.cliente");

        return ['alias' => $t1, 'query' => $query];
    }
}