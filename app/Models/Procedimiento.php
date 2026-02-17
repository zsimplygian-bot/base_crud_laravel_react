<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class Procedimiento extends BaseModel
{
    use HasFactory;
    protected $table = 'procedimiento';
    protected static $validationRules = [
        'procedimiento' => 'required|string|max:255',
        'id_categoria_procedimiento' => 'required|integer',
        'descripcion' => 'nullable|string',
        'precio' => 'required|numeric',
    ];
    protected static $tableColumns = [
        ['ID','id'],
        ['PROCEDIMIENTO','procedimiento'],
        ['CATEGORIA', 'categoria_procedimiento'],
        ['DESCRIPCIÓN', 'descripcion'],
        ['PRECIO', 'precio'],
        ['FECHA REGISTRO', 'created_at'],
    ];
    public static function getQuery(): array
    {
        $t1 = (new self)->getTable();
        $t2 = 'categoria_procedimiento';
        return [
            'alias' => $t1,
            'query' => DB::table($t1)
            ->leftjoin($t2, "$t1.id_$t2", "=", "$t2.id_$t2")
            ->select([
                "$t1.id_$t1 as id",
                "$t1.procedimiento",
                "$t2.categoria_procedimiento",
                "$t1.descripcion",
                "$t1.precio",
                "$t1.created_at",
            ]),
        ];
    }
    protected $appends = ['label'];
    public function getLabelAttribute(): string
    {
        return $this->procedimiento; // Texto mostrado en combobox
    }
    public function categoria_procedimiento() { return $this->belongsTo(CategoriaProcedimiento::class, 'id_categoria_procedimiento'); } // Relación raza
}