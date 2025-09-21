<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class Cita extends BaseModel
{
    use HasFactory;
    protected $table = 'cita';
    public static string $title = 'Citas';
    protected static $simpleFormFieldDefinitions = [
        ['id_mascota', 'MASCOTA', 'select'],
        ['fecha', 'FECHA', 'date'],
        ['hora', 'HORA', 'time'],
        ['motivo', 'MOTIVO', 'text'],
        ['id_estado', 'ESTADO', 'select'],
    ];
    protected static $validationRules = [
        'id_mascota' => 'required|int',
        'fecha' => 'required|date',
        'hora' => 'required',
        'motivo' => 'nullable|string|max:255',
        'id_estado' => 'nullable|string|max:50',
    ];
    protected static $tableColumns = [
        ['ID', 'id'],
        ['MASCOTA', 'mascota'],
        ['FECHA', 'fecha'],
        ['HORA', 'hora'],
        ['MOTIVO', 'motivo'],
        ['ESTADO', 'estado'],
        ['FECHA REGISTRO', 'created_at'],
    ];
    public static function getQuery()
    {
        $alias = (new self)->getTable();
        $alias2 = 'mascota';
        $alias3 = 'estado';
        $query = DB::table($alias)
            ->leftJoin($alias2, "{$alias}.id_{$alias2}", '=', "{$alias2}.id_{$alias2}")
            ->leftJoin($alias3, "{$alias}.id_{$alias3}", '=', "{$alias3}.id_{$alias3}")
            ->select([
                "{$alias}.id_{$alias} as id",
                "{$alias2}.mascota as mascota",
                "{$alias}.fecha",
                "{$alias}.hora",
                "{$alias}.motivo",
                "{$alias3}.estado",
                "{$alias}.created_at",
            ]);
        return ['query' => $query, 'alias' => $alias];
    }
}