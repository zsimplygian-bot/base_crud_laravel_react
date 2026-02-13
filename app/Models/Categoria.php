<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class Categoria extends BaseModel
{
    use HasFactory;
    protected $table = 'categoria';
    protected static $validationRules = [
        'categoria' => 'required|string|max:100',
        'emoji' => 'nullable|string|max:100',
    ];
    protected static $tableColumns = [
        ['ID', 'id'],
        ['CATEGORIA', 'categoria'],
        ['EMOJI', 'emoji'],
    ];
    public static function getQuery(): array
    {
        $t1 = (new self)->getTable();
        return [
            'alias' => $t1,
            'query' => DB::table($t1)->select([
                "$t1.id_$t1 as id",
                "$t1.categoria",
                "$t1.emoji",
            ]),
        ];
    }
}