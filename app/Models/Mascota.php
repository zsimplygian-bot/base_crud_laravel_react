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
        ['especie', 'ESPECIE', 'text'],
        ['raza', 'RAZA', 'text'],
        ['id_sexo', 'SEXO', 'select'],
        ['edad', 'EDAD (AÑOS)', 'tel'],
        ['color', 'COLOR', 'text'],
        ['peso', 'PESO (KG)', 'number'],
        //['imagen', 'IMAGEN', 'file'],
    ];
    protected static $validationRules = [
        'mascota' => 'required|string|max:255',
        'id_cliente' => 'required|int',
        'especie' => 'required|string|max:255',
        'raza' => 'nullable|string|max:255',
        'id_sexo' => 'nullable|int|max:2',
        'edad' => 'nullable|int',
        'color' => 'nullable|string|max:100',
        'peso' => 'nullable|numeric',
        //'imagen' => 'nullable|string|max:255',
    ];
    protected static $tableColumns = [
        ['ID', 'id'],
        ['NOMBRE', 'mascota'],
        ['DUEÑO', 'cliente'],
        ['ESPECIE', 'especie'],
        ['RAZA', 'raza'],
        ['SEXO', 'sexo'],
        ['EDAD', 'edad'],
        ['COLOR', 'color'],
        ['PESO', 'peso'],
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
        $alias = (new self)->getTable();
        $alias2 = 'cliente';
        $alias3 = 'sexo';
        $query = DB::table($alias)
            ->leftJoin($alias2, "{$alias}.id_{$alias2}", '=', "{$alias2}.id_{$alias2}")
            ->leftJoin($alias3, "{$alias}.id_{$alias3}", '=', "{$alias3}.id_{$alias3}")
            ->select([
                "{$alias}.id_{$alias} as id",
                "{$alias}.mascota",
                "{$alias2}.cliente",
                "{$alias}.especie",
                "{$alias}.raza",
                "{$alias3}.sexo",
                "{$alias}.edad",
                "{$alias}.color",
                "{$alias}.peso",
                "{$alias}.imagen",
                "{$alias}.created_at",
            ]);
        return ['query' => $query, 'alias' => $alias];
    }
}