<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class Mascota extends BaseModel
{
    use HasFactory;
    protected $table = 'mascota';
    public static string $title = 'Mascotas';
    protected static $simpleFormFieldDefinitions = [
        ['mascota', 'NOMBRE', 'text'],
        ['id_cliente', 'DUEÑO', 'select'],
        ['id_raza', 'ESPECIE - RAZA', 'select'],
        ['id_sexo', 'SEXO', 'select'],
        ['id_unidad_tiempo', 'UNIDAD EDAD', 'select'],
        ['edad', 'EDAD', 'number'],
        ['color', 'COLOR', 'text'],
        ['peso', 'PESO (KG)', 'number'],
        ['observaciones', 'OBSERVACIONES', 'textarea'],
        //['imagen', 'IMAGEN', 'file'],
    ];
    protected static $validationRules = [
        'mascota' => 'required|string|max:255',
        'id_cliente' => 'required|int',
        'id_raza' => 'required|int',
        'id_sexo' => 'required|int|max:2',
        'id_unidad_tiempo' => 'required|int|max:2',
        'edad' => 'nullable|int',
        'color' => 'nullable|string|max:100',
        'peso' => 'nullable|numeric',
        'observaciones' => 'nullable|string',
        //'imagen' => 'nullable|string|max:255',
    ];
    protected static $toolbarfieldDefinitions = [
        'id_cliente' => ['label' => 'DUEÑO', 'type' => 'select', 'width' => 2],
        'id_raza' => ['label' => 'ESPECIE - RAZA', 'type' => 'select', 'width' => 2],
        'id_sexo' => ['label' => 'SEXO', 'type' => 'select', 'width' => 2],
    ];
    public static array $allowedFilters = ['id_cliente', 'id_raza', 'id_sexo'];
    protected static $tableColumns = [
        ['ID', 'id'],
        ['NOMBRE', 'mascota'],
        ['DUEÑO', 'cliente'],
        ['ESPECIE', 'especie'],
        ['RAZA', 'raza'],
        ['SEXO', 'sexo'],
        ['EDAD', 'edad'],
        ['COLOR', 'color'],
        ['PESO (KG)', 'peso'],
        //['FOTO', 'imagen'],
        ['FECHA REGISTRO', 'created_at'],
    ];
    protected static array $apiConfig = [
        //'inputKey' => 'especie',
        'type' => 'file',
        'endpoint' => 'clasificador-imagen',
        'fields' => [
            'especie' => 'especie',
            'raza' => 'raza',
        ],
        'emptyValue' => '-',
    ];
    public static function getQuery()
{
    $alias = (new self)->getTable();         // mascota
    $alias2 = 'cliente';
    $alias3 = 'raza';
    $alias4 = 'especie';
    $alias5 = 'sexo';
    $alias6 = 'unidad_tiempo';

    $query = DB::table($alias)
        ->leftJoin($alias2, "{$alias}.id_{$alias2}", '=', "{$alias2}.id_{$alias2}")
        ->leftJoin($alias3, "{$alias}.id_{$alias3}", '=', "{$alias3}.id_{$alias3}")
        ->leftJoin($alias4, "{$alias3}.id_{$alias4}", '=', "{$alias4}.id_{$alias4}")
        ->leftJoin($alias5, "{$alias}.id_{$alias5}", '=', "{$alias5}.id_{$alias5}")
        ->leftJoin($alias6, "{$alias}.id_{$alias6}", '=', "{$alias6}.id_{$alias6}")
        ->select([
            "{$alias}.id_{$alias} as id",
            "{$alias}.mascota",
            "{$alias2}.cliente",
            "{$alias4}.especie",
            "{$alias3}.raza",
            "{$alias5}.sexo",
            DB::raw("CONCAT({$alias}.edad, ' ', {$alias6}.unidad_tiempo) as edad"),
            "{$alias}.color",
            "{$alias}.peso",
            "{$alias}.imagen",
            "{$alias}.created_at",
        ]);

    return ['query' => $query, 'alias' => $alias];
}

}