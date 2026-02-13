<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class Producto extends BaseModel
{
    use HasFactory;
    protected $table = 'producto';
    protected static $validationRules = [
        'producto' => 'required|string|max:255',
        'id_categoria' => 'required|integer',
        'descripcion' => 'nullable|string',
        'precio' => 'nullable|float',
    ];
    protected static $tableColumns = [
        ['ID', 'id'],
        ['PRODUCTO', 'producto'],
        ['CATEGORIA', 'categoria'],
        ['DESCRIPCIÓN', 'descripcion'],
        ['PRECIO', 'precio'],
        ['FECHA REGISTRO', 'created_at'],
    ];
    public static function getQuery(): array
    {
        $t1 = (new self)->getTable();
        $t2 = 'categoria';
        return [
            'alias' => $t1,
            'query' => DB::table($t1)
            ->leftjoin($t2, "$t1.id_$t2", "=", "$t2.id_$t2")
            ->select([
                "$t1.id_$t1 as id",
                "$t1.producto",
                "$t2.categoria",
                "$t1.descripcion",
                "$t1.precio",
                "$t1.created_at",
            ]),
        ];
    }
    protected $appends = ['label'];
    public function getLabelAttribute(): string
    {
        return $this->producto; // Texto mostrado en combobox
    }
    public function categoria() { return $this->belongsTo(Categoria::class, 'id_categoria'); } // Relación raza
}