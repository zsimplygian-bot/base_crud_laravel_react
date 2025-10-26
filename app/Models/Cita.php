<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;
class Cita extends BaseModel
{
    use HasFactory;
    protected $table = 'cita';
    public static string $title = 'Citas';
    protected static $simpleFormFieldDefinitions = [
        ['id_mascota', 'MASCOTA - DUEÑO', 'select'],
        ['fecha', 'FECHA', 'date'],
        ['hora', 'HORA', 'time'],
        ['id_motivo_cita', 'MOTIVO', 'select'],
        ['observaciones', 'OBSERVACIONES', 'textarea'],
        ['id_estado_cita', 'ESTADO', 'select'],
    ];
    public static function getFieldDefinitions(string $type, string $action = 'create', $data = null): array
    {
        // Usa el método genérico del padre para obtener las definiciones base
        $fields = parent::getFieldDefinitions($type, $action, $data);
        // Si es formulario de creación, excluir campos específicos
        if ($type === 'form' && $action === 'create') {
            unset($fields['observaciones'], $fields['id_estado_cita']);
        }
        return $fields;
    }
    protected static $validationRules = [
        'id_mascota' => 'required|int',
        'fecha' => 'required|date',
        'hora' => 'required',
        'id_motivo_cita' => 'required|int',
        'observaciones' => 'nullable|string',
        'id_estado_cita' => 'required|int',
    ];
    public static function getValidationRules(string $action = 'create'): array
{
    $rules = parent::getValidationRules();

    // Si es creación, eliminar validación de estado
    if ($action === 'create') {
        unset($rules['id_estado_cita']);
    }

    return $rules;
}

    protected static $simpleToolbarFieldDefinitions = [
        ['id_mascota', 'MASCOTA - DUEÑO', 'select'],
        ['id_motivo_cita', 'MOTIVO', 'select'],
        ['id_estado_cita', 'ESTADO', 'select'],
    ];
    public static array $allowedFilters = ['id_mascota', 'id_motivo_cita', 'id_estado_cita'];
    public static function getQuery()
    {
        $alias = (new self)->getTable();
        $alias2 = 'mascota';
        $alias3 = 'estado_cita';
        $alias4 = 'motivo_cita';
        $alias5 = 'cliente';
        $query = DB::table($alias)
            ->leftJoin($alias2, "{$alias}.id_{$alias2}", '=', "{$alias2}.id_{$alias2}")
            ->leftJoin($alias3, "{$alias}.id_{$alias3}", '=', "{$alias3}.id_{$alias3}")
            ->leftJoin($alias4, "{$alias}.id_{$alias4}", '=', "{$alias4}.id_{$alias4}")
            ->leftJoin($alias5, "{$alias2}.id_{$alias5}", '=', "{$alias5}.id_{$alias5}")
            ->select([
                "{$alias}.id_{$alias} as id",
                "{$alias2}.mascota as mascota",
                "{$alias5}.cliente as cliente",
                "{$alias}.fecha",
                "{$alias}.hora",
                "{$alias4}.motivo_cita",
                "{$alias3}.estado_cita as estado",
                "{$alias}.created_at",
            ]);

        return ['query' => $query, 'alias' => $alias];
    }
    public static function proximas()
    {
        return DB::table('cita')
            ->join('mascota', 'cita.id_mascota', '=', 'mascota.id_mascota')
            ->join('cliente', 'mascota.id_cliente', '=', 'cliente.id_cliente')
            ->join('motivo_cita', 'cita.id_motivo_cita', '=', 'motivo_cita.id_motivo_cita')
            ->select(
                'cita.id_cita as id',
                'mascota.mascota',
                'cliente.cliente',
                'motivo_cita.motivo_cita',
                DB::raw("CONCAT(cita.fecha, ' ', cita.hora) as fecha_hora")
            )
            ->whereRaw("CONCAT(cita.fecha, ' ', cita.hora) >= NOW()")
            ->orderByRaw("CONCAT(cita.fecha, ' ', cita.hora) ASC") // ← cita más cercana arriba
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