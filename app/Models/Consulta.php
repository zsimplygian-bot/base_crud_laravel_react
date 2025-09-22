<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class Consulta extends BaseModel
{
    use HasFactory;
    protected $table = 'consulta';
    public static string $title = 'Consultas';
    protected static $simpleFormFieldDefinitions = [
        ['id_mascota', 'MASCOTA', 'select'],
        ['fecha', 'FECHA', 'date'],
        ['sintomas', 'SÍNTOMAS', 'text'],
        ['diagnostico', 'DIAGNÓSTICO', 'textarea'],
        ['tratamiento', 'TRATAMIENTO', 'textarea'],
        ['precio', 'PRECIO', 'number'],
        ['observaciones', 'OBSERVACIONES', 'textarea'],
    ];
    protected static $validationRules = [
        'id_mascota' => 'required|int',
        'fecha' => 'required|date',
        'sintomas' => 'nullable|string',
        'diagnostico' => 'nullable|string',
        'tratamiento' => 'nullable|string',
        'precio' => 'required|numeric',
        'observaciones' => 'nullable|string',
    ];
    protected static $footerfieldDefinitions = [
        'precio' => [ 'label' => 'Total', 'type' => 'text', 'width' => 2],
    ];
    protected static $tableColumns = [
        ['ID', 'id'],
        ['MASCOTA', 'mascota'],
        ['FECHA', 'fecha'],
        ['SÍNTOMAS', 'sintomas'],
        ['DIAGNÓSTICO', 'diagnostico'],
        ['TRATAMIENTO', 'tratamiento'],
        ['PRECIO', 'precio'],
        ['OBSERVACIONES', 'observaciones'],
        ['FECHA REGISTRO', 'created_at'],
    ];
    protected static array $apiConfig = [
        //'inputKey' => 'sintomas',
        'endpoint' => 'diagnostico',
        'type' => 'text',
        'fields' => [
            'diagnostico' => 'diagnostico',
        ],
        'emptyValue' => '-',
    ];
    public static function getQuery()
    {
        $alias = (new self)->getTable();
        $alias2 = 'mascota';
        $query = DB::table($alias)
            ->leftJoin($alias2, "{$alias}.id_{$alias2}", '=', "{$alias2}.id_{$alias2}")
            ->select([
                "{$alias}.id_{$alias} as id",
                "{$alias2}.mascota as mascota",
                "{$alias}.fecha",
                "{$alias}.sintomas",
                "{$alias}.diagnostico",
                "{$alias}.tratamiento",
                "{$alias}.precio",
                "{$alias}.observaciones",
                "{$alias}.created_at",
            ]);
        return ['query' => $query, 'alias' => $alias];
    }
}