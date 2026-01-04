<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class Especie extends BaseModel
{
    use HasFactory;
    protected $table = 'especie';
    protected static $validationRules = [
        'especie' => 'required|string|max:100',
    ];
    protected static $tableColumns = [
        ['ID', 'id'],
        ['ESPECIE', 'especie'],
    ];
    public static function getQuery(): array
    {
        $t1 = (new self)->getTable();
        return [
            'alias' => $t1,
            'query' => DB::table($t1)->select([
                "$t1.id_$t1 as id",
                "$t1.especie",
            ]),
        ];
    }
}