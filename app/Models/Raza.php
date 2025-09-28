<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class Raza extends BaseModel
{
    use HasFactory;
    protected $table = 'raza';
    public static string $title = 'Razas';
    protected static $simpleFormFieldDefinitions = [
        ['id_especie', 'ESPECIE',  'select'], 
        ['raza', 'RAZA', 'text', ],
    ];
    protected static $validationRules = [
        'id_especie' => 'required|int|max:255',
        'raza' => 'required|string|max:100',
    ];
    protected static $tableColumns = [
        ['ID', 'id'],
        ['ESPECIE', 'especie'],
        ['RAZA', 'raza'],
    ];
    public static function getQuery()
    {
        $alias = (new self)->getTable();
        $alias2 = 'especie';
        $query = DB::table($alias)
            ->leftJoin($alias2, "{$alias}.id_{$alias2}", '=', "{$alias2}.id_{$alias2}")
            ->select([
                "{$alias}.id_{$alias} as id",
                "{$alias2}.especie",
                "{$alias}.raza",
            ]);
        return ['query' => $query, 'alias' => $alias];
    }
}