<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class CategoriaProducto extends BaseModel
{
    use HasFactory;
    protected $table = 'categoria_producto';
    protected static $validationRules = [
        'categoria_producto' => 'required|string|max:100',
        'emoji_categoria_producto' => 'nullable|string|max:100',
    ];
    protected static $tableColumns = [
        ['ID', 'id'],
        ['CATEGORIA', 'categoria_producto'],
        ['EMOJI', 'emoji_categoria_producto'],
    ];
    public static function getQuery(): array
    {
        $t1 = (new self)->getTable();
        return [
            'alias' => $t1,
            'query' => DB::table($t1)->select([
                "$t1.id_$t1 as id",
                "$t1.categoria_producto",
                "$t1.emoji_categoria_producto",
            ]),
        ];
    }
}