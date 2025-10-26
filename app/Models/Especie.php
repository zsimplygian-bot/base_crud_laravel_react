<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class Especie extends BaseModel
{
    use HasFactory;
    protected $table = 'especie';
    public static string $title = 'Especies';
    protected static $simpleFormFieldDefinitions = [
        ['especie', 'Especie', 'text'],
    ];
    protected static $validationRules = [
        'especie' => 'required|string|max:100',
    ];
    public static function getQuery()
    {
        $alias = (new self)->getTable();
        $query = DB::table($alias)
            ->select([
                "{$alias}.id_{$alias} as id",
                "{$alias}.{$alias}",
            ]);
        return ['query' => $query, 'alias' => $alias];
    }
    protected static $tableColumns = [
        ['ID', 'id'],
        ['ESPECIE', 'especie'],
    ];

}