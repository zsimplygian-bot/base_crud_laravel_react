<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
class Cita extends BaseModel
{
    use HasFactory;
    protected $table = 'cita';
    public static string $title = 'Citas';
    protected static $simpleFormFieldDefinitions = [
        ['id_mascota', 'MASCOTA - DUEÑO', 'select', 'required'],
        ['fecha', 'FECHA', 'date', 1, 'required'],
        ['hora', 'HORA', 'time', 1, 'required'],
        ['id_motivo_cita', 'MOTIVO CITA', 'select', 'required'],
        ['observaciones', 'OBSERVACIONES', 'textarea'],
        ['id_estado_cita', 'ESTADO CITA', 'select'],
    ];
    public static function getFieldDefinitions(string $type, string $action = null, $data = null): array
    {
        $defs = parent::getFieldDefinitions($type, $action, $data);
        if ($action === 'create' && isset($defs['id_estado_cita'])) {
            $defs['id_estado_cita']['type'] = 'hidden';
            $defs['id_estado_cita']['value'] = 1;
        }
        return $defs;
    }
    protected static $validationRules = [
        'id_mascota'       => 'required|integer',
        'fecha'            => 'required|date|after_or_equal:today',
        'hora'             => 'required',
        'id_motivo_cita'   => 'required|integer',
        'observaciones'    => 'nullable|string',
        'id_estado_cita'   => 'required|integer',
    ];
    protected static $simpleToolbarFieldDefinitions = [
        ['id_mascota', 'MASCOTA - DUEÑO', 'select'],
        ['id_motivo_cita', 'MOTIVO CITA', 'select'],
        ['id_estado_cita', 'ESTADO CITA', 'select'],
    ];
    public static array $allowedFilters = ['id_mascota', 'id_motivo_cita', 'id_estado_cita'];
    public static function getQuery()
    {
        $al1 = 'cita';
        $al2 = 'mascota';
        $al3 = 'estado_cita';
        $al4 = 'motivo_cita';
        $al5 = 'cliente';
        $query = DB::table("$al1")
            ->leftJoin("$al2", "$al1.id_$al2", '=', "$al2.id_$al2")
            ->leftJoin("$al3", "$al1.id_$al3", '=', "$al3.id_$al3")
            ->leftJoin("$al4", "$al1.id_$al4", '=', "$al4.id_$al4")
            ->leftJoin("$al5", "$al2.id_$al5", '=', "$al5.id_$al5")
            ->select([
                "$al1.id_$al1 as id",
                "$al2.mascota as mascota",
                "$al5.cliente as cliente",
                "$al1.fecha",
                "$al1.hora",
                "$al4.motivo_cita",
                "$al3.estado_cita as estado",
                "$al1.created_at",
            ]);

        return ['query' => $query, 'alias' => $al1];
    }
    public static function proximas()
    {
        $al1 = 'cita';
        $al2 = 'mascota';
        $al3 = 'cliente';
        $al4 = 'motivo_cita';
        return DB::table("$al1")
            ->join("$al2", "$al1.id_$al2", '=', "$al2.id_$al2")
            ->join("$al3", "$al2.id_$al3", '=', "$al3.id_$al3")
            ->join("$al4", "$al1.id_$al4", '=', "$al4.id_$al4")
            ->select(
                "$al1.id_$al1 as id",
                "$al2.mascota",
                "$al3.cliente",
                "$al4.motivo_cita",
                DB::raw("CONCAT($al1.fecha, ' ', $al1.hora) as fecha_hora")
            )
            ->where("$al1.id_estado_cita", 1) // ← Filtro agregado
            ->whereRaw("CONCAT($al1.fecha, ' ', $al1.hora) >= NOW()")
            ->orderByRaw("CONCAT($al1.fecha, ' ', $al1.hora) ASC")
            ->get();
    }
    protected static $tableColumns = [
        ['ID', 'id'],
        ['MASCOTA', 'mascota'],
        ['DUEÑO', 'cliente'],
        ['FECHA', 'fecha'],
        ['HORA', 'hora'],
        ['MOTIVO', 'motivo_cita'],
        ['ESTADO', 'estado'],
        ['FECHA REGISTRO', 'created_at'],
    ];
}