<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class Vacuna extends BaseModel
{
    use HasFactory;
    protected $table = 'vacuna';
    public static string $title = 'Vacunas';
    protected static $simpleFormFieldDefinitions = [
        ['id_mascota', 'MASCOTA', 'select'],
        ['vacuna', 'VACUNA', 'text'],
        ['descripcion', 'DESCRIPCIÓN', 'text'],
        ['fecha_aplicacion', 'FECHA DE APLICACIÓN', 'date'],
        ['proxima_dosis', 'PRÓXIMA DOSIS', 'date'],
        ['precio', 'PRECIO', 'number'],
        ['observaciones', 'OBSERVACIONES', 'textarea'],
    ];
    protected static $validationRules = [
        'id_mascota' => 'required|int',
        'vacuna' => 'required|string|max:255',
        'descripcion' => 'nullable|string|max:255',
        'fecha_aplicacion' => 'required|date',
        'proxima_dosis' => 'nullable|date',
        'precio' => 'required|numeric',
        'observaciones' => 'nullable|string',
    ];
    protected static $footerfieldDefinitions = [
        'precio' => [ 'label' => 'Total', 'type' => 'text', 'width' => 2],
    ];
    protected static $tableColumns = [
        ['ID', 'id'],
        ['MASCOTA', 'mascota'],
        ['VACUNA', 'vacuna'],
        ['DESCRIPCIÓN', 'descripcion'],
        ['FECHA APLICACIÓN', 'fecha_aplicacion'],
        ['PRÓXIMA DOSIS', 'proxima_dosis'],
        ['PRECIO', 'precio'],
        ['OBSERVACIONES', 'observaciones'],
        ['FECHA REGISTRO', 'created_at'],
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
                "{$alias}.vacuna",
                "{$alias}.descripcion",
                "{$alias}.fecha_aplicacion",
                "{$alias}.proxima_dosis",
                "{$alias}.precio",
                "{$alias}.observaciones",
                "{$alias}.created_at",
            ]);
        return ['query' => $query, 'alias' => $alias];
    }
}