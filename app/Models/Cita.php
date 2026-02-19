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
        'id_motivo'      => 'required|integer',
        'observaciones'  => 'nullable|string',
        'id_estado_cita' => 'required|integer',
    ];
    protected static $tableColumns = [
        ['ID', 'id'],
        ['MASCOTA', 'mascota'],
        ['DUEÑO', 'cliente'],
        ['FECHA', 'fecha'],
        ['MOTIVO', 'motivo'],
        ['MOTIVO', 'emoji_motivo'],
        ['ESTADO', 'estado_cita'],
        ['FECHA REGISTRO', 'created_at'],
    ];
    protected static function baseQuery()
    {
        $t1 = (new self)->getTable(); // cita
        $t2 = 'mascota';
        $t3 = 'cliente';
        $t4 = 'estado_cita';
        $t5 = 'motivo';
        return DB::table($t1)
            ->leftJoin($t2, "$t1.id_$t2", '=', "$t2.id_$t2")
            ->leftJoin($t3, "$t2.id_$t3", '=', "$t3.id_$t3")
            ->leftJoin($t4, "$t1.id_$t4", '=', "$t4.id_$t4")
            ->leftJoin($t5, "$t1.id_$t5", '=', "$t5.id_$t5");
    }
    public static function getQuery(): array
    {
        $t1 = (new self)->getTable();
        $t2 = 'mascota';
        $t3 = 'cliente';
        $t4 = 'estado_cita';
        $t5 = 'motivo';
        return [
            'alias' => $t1,
            'query' => self::baseQuery()->select([
                "$t1.id_$t1 as id",
                "$t2.mascota",
                "$t3.cliente",
                "$t1.fecha",
                "$t5.motivo",
                "$t5.emoji_motivo",
                "$t4.estado_cita",
                "$t1.created_at",
            ]),
        ];
    }
    public static function proximas()
    {
        $t1 = (new self)->getTable();
        $t2 = 'mascota';
        $t3 = 'cliente';
        $t5 = 'motivo';
        return self::baseQuery()
            ->select([
                "$t1.id_$t1 as id",
                "$t2.mascota",
                "$t3.cliente",
                "$t5.motivo",
                "$t1.fecha",
            ])
            ->where("$t1.id_estado_cita", 1) // Pendientes
            ->whereDate("$t1.fecha", '>=', now())
            ->orderBy("$t1.fecha")
            ->get();
    }
    public static function eventosEntreFechas(string $start, string $end)
    {
        $t1 = (new self)->getTable();
        $t2 = 'mascota';
        $t3 = 'cliente';
        $t5 = 'motivo';
        return self::baseQuery()
            ->select([
                "$t1.id_$t1 as id",
                "$t2.mascota",
                "$t3.cliente",
                "$t5.motivo",
                "$t1.id_estado_cita",
                "$t1.fecha_hora_notificacion",
                "$t1.fecha",
                DB::raw("$t1.fecha as start"),
            ])
            ->whereBetween("$t1.fecha", [$start, $end])
            ->get();
    }
}