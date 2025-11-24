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
    // Sobrescribimos el hook para acción create
    protected static function adjustFieldForAction(array $fieldDef, string $fieldName, ?string $action): array
    {
        if ($fieldName === 'id_estado_cita' && $action === 'create') {
            $fieldDef['type'] = 'hidden';
            $fieldDef['value'] = 1;
        }
        return $fieldDef;
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
        $t1 = (new self)->getTable();
        $t2 = 'mascota';
        $t3 = 'estado_cita';
        $t4 = 'motivo_cita';
        $t5 = 'cliente';
        $query = DB::table($t1)
            ->leftJoin($t2, "$t1.id_$t2", '=', "$t2.id_$t2")
            ->leftJoin($t3, "$t1.id_$t3", '=', "$t3.id_$t3")
            ->leftJoin($t4, "$t1.id_$t4", '=', "$t4.id_$t4")
            ->leftJoin($t5, "$t2.id_$t5", '=', "$t5.id_$t5")
            ->select([
                "$t1.id_$t1 as id",
                "$t2.mascota",
                "$t5.cliente",
                "$t1.fecha",
                "$t1.hora",
                "$t4.motivo_cita",
                "$t3.estado_cita as estado",
                "$t1.created_at",
            ]);
        return ['query' => $query, 'alias' => $t1];
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
    public static function proximas()
    {
        $t1 = (new self)->getTable();
        $t2 = 'mascota';
        $t3 = 'cliente';
        $t4 = 'motivo_cita';
        return DB::table("$t1")
            ->join("$t2", "$t1.id_$t2", '=', "$t2.id_$t2")
            ->join("$t3", "$t2.id_$t3", '=', "$t3.id_$t3")
            ->join("$t4", "$t1.id_$t4", '=', "$t4.id_$t4")
            ->select([
                "$t1.id_$t1 as id",
                "$t2.mascota",
                "$t3.cliente",
                "$t4.motivo_cita",
                DB::raw("CONCAT($t1.fecha, ' ', $t1.hora) as fecha_hora")
            ])
            ->where("$t1.id_estado_cita", 1)
            ->whereRaw("CONCAT($t1.fecha, ' ', $t1.hora) >= NOW()")
            ->orderByRaw("CONCAT($t1.fecha, ' ', $t1.hora) ASC")
            ->get();
    }
}