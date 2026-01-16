<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class Cita extends BaseModel {
    use HasFactory;
    protected $table = 'cita';
    protected static $validationRules = [
        'id_mascota'     => 'required|integer',
        'fecha'          => 'required|date',
        'hora'           => 'required',
        'id_motivo_cita' => 'required|integer',
        'observaciones'  => 'nullable|string',
        'id_estado_cita' => 'required|integer',
    ];
    protected static $tableColumns = [
        ['ID', 'id'],
        ['MASCOTA - DUEÑO', 'mascota'],
        ['FECHA', 'fecha'],
        ['HORA', 'hora'],
        ['MOTIVO', 'motivo_cita'],
        ['ESTADO', 'estado_cita'],
        ['FECHA REGISTRO', 'created_at'],
    ];
    public static function getQuery(): array {
        $t1 = (new self)->getTable(); // cita
        $t2 = 'mascota';
        $t3 = 'estado_cita';
        $t4 = 'motivo_cita';
        $t5 = 'cliente';
        return [
            'alias' => $t1,
            'query' => DB::table($t1)
                ->leftJoin($t2, "$t1.id_$t2", '=', "$t2.id_$t2")
                ->leftJoin($t3, "$t1.id_$t3", '=', "$t3.id_$t3")
                ->leftJoin($t4, "$t1.id_$t4", '=', "$t4.id_$t4")
                ->leftJoin($t5, "$t2.id_$t5", '=', "$t5.id_$t5")
                ->select([
                    "$t1.id_$t1 as id",
                    DB::raw("CONCAT($t2.mascota,' - ',$t5.cliente) as mascota"),
                    "$t1.fecha",
                    "$t1.hora",
                    "$t4.motivo_cita",
                    "$t3.estado_cita",
                    "$t1.created_at",
                ])
        ];
    }
    public static function proximas() {
        $t1 = (new self)->getTable(); // cita
        $t2 = 'mascota';
        $t3 = 'cliente';
        $t4 = 'motivo_cita';
        return DB::table($t1)
            ->join($t2, "$t1.id_$t2", '=', "$t2.id_$t2")
            ->join($t3, "$t2.id_$t3", '=', "$t3.id_$t3")
            ->join($t4, "$t1.id_$t4", '=', "$t4.id_$t4")
            ->select([
                "$t1.id_$t1 as id",
                "$t2.mascota",
                "$t3.cliente",
                "$t4.motivo_cita",
                "$t1.fecha",
                "$t1.hora",
            ])
            ->where("$t1.id_estado_cita", 1) // Pendientes
            ->whereRaw("$t1.fecha >= CURDATE()")
            ->orderBy("$t1.fecha")
            ->orderBy("$t1.hora")
            ->get();
    }
    public static function eventosEntreFechas(string $start, string $end) {
        $t1 = (new self)->getTable(); // cita
        $t2 = 'mascota';
        $t3 = 'cliente';
        $t4 = 'motivo_cita';
        return DB::table($t1)
            ->join($t2, "$t1.id_$t2", '=', "$t2.id_$t2")
            ->join($t3, "$t2.id_$t3", '=', "$t3.id_$t3")
            ->join($t4, "$t1.id_$t4", '=', "$t4.id_$t4")
            ->select([
                "$t1.id_$t1 as id",
                "$t2.mascota",
                "$t3.cliente",
                "$t4.motivo_cita",
                "$t1.id_estado_cita",
                "$t1.fecha_hora_notificacion",
                "$t1.fecha",
                "$t1.hora",
                DB::raw("CONCAT($t1.fecha,'T',$t1.hora) as start"),
            ])
            ->whereBetween("$t1.fecha", [$start, $end])
            ->get();
    }
}