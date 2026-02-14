<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class CategoriaProcedimiento extends BaseModel
{
    use HasFactory;
    protected $table = 'categoria_procedimiento';
    protected static $validationRules = [
        'categoria_procedimiento' => 'required|string|max:100',
        'emoji_categoria_procedimiento' => 'nullable|string|max:100',
    ];
    protected static $tableColumns = [
        ['ID', 'id'],
        ['CATEGORIA', 'categoria_procedimiento'],
        ['EMOJI', 'emoji_categoria_procedimiento'],
    ];
    public static function getQuery(): array
    {
        $t1 = (new self)->getTable();
        return [
            'alias' => $t1,
            'query' => DB::table($t1)->select([
                "$t1.id_$t1 as id",
                "$t1.categoria_procedimiento",
                "$t1.emoji_categoria_procedimiento",
            ]),
        ];
    }
}