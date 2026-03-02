<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class Cita extends BaseModel {
    use HasFactory;
    protected $table = 'cita';
    protected static $validationRules = [
        'id_mascota'     => 'required|integer',
        'fecha' => 'required|date_format:Y-m-d H:i:s',
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
        ['EMOJI', 'emoji_motivo'],
        ['ESTADO', 'estado_cita'],
        ['FECHA REGISTRO', 'created_at'],
    ];
    protected static function tables(): array
    {
        return [
            'cita'        => (new self)->getTable(),
            'mascota'     => 'mascota',
            'cliente'     => 'cliente',
            'estado'      => 'estado_cita',
            'motivo'      => 'motivo',
        ];
    }
    protected static function baseQuery()
    {
        extract(self::tables());
        return DB::table($cita)
            ->leftJoin($mascota, "$cita.id_mascota", '=', "$mascota.id_mascota")
            ->leftJoin($cliente, "$mascota.id_cliente", '=', "$cliente.id_cliente")
            ->leftJoin($estado, "$cita.id_estado_cita", '=', "$estado.id_estado_cita")
            ->leftJoin($motivo, "$cita.id_motivo", '=', "$motivo.id_motivo");
    }
    public static function getQuery(): array
    {
        extract(self::tables());
        return [
            'alias' => $cita,
            'query' => self::baseQuery()->select([
                "$cita.id_cita as id",
                "$mascota.mascota",
                "$cliente.cliente",
                "$cita.fecha",
                "$motivo.motivo",
                "$motivo.emoji_motivo",
                "$estado.estado_cita",
                "$cita.created_at",
            ]),
        ];
    }
    public static function proximas()
    {
        extract(self::tables());
        return self::baseQuery()
            ->select([
                "$cita.id_cita as id",
                "$mascota.mascota",
                "$cliente.cliente",
                "$motivo.motivo",
                "$cita.fecha",
            ])
            ->where("$cita.id_estado_cita", 1)
            ->whereDate("$cita.fecha", '>=', now())
            ->orderBy("$cita.fecha")
            ->get();
    }
    public static function eventosEntreFechas(string $start, string $end) {
        extract(self::tables());
        return self::baseQuery()
            ->select([
                "$cita.id_cita as id",
                "$mascota.mascota",
                "$cliente.cliente",
                "$motivo.motivo",
                "$cita.id_estado_cita",
                "$cita.fecha_hora_notificacion",
                "$cita.fecha",
                DB::raw("$cita.fecha as start"),
            ])
            ->whereBetween("$cita.fecha", [$start, $end])
            ->get();
    }
}