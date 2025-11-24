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
        ['especie', 'ESPECIE', 'text'],
    ];
    protected static $validationRules = [
        'especie' => 'required|string|max:100',
    ];
    public static function getQuery()
    {
        $t1 = (new self)->getTable();
        $query = DB::table($t1)->select([
            "$t1.id_$t1 as id",
            "$t1.$t1",
        ]);
        return ['query' => $query, 'alias' => $t1];
    }
    protected static $tableColumns = [
        ['ID', 'id'],
        ['ESPECIE', 'especie'],
    ];

}