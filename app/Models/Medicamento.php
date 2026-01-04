<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class Medicamento extends BaseModel
{
    use HasFactory;
    protected $table = 'medicamento';
    protected static $validationRules = [
        'medicamento' => 'required|string|max:255',
        'descripcion' => 'nullable|string',
    ];
    protected static $tableColumns = [
        ['ID', 'id'],
        ['MEDICAMENTO', 'medicamento'],
        ['DESCRIPCIÓN', 'descripcion'],
        ['FECHA REGISTRO', 'created_at'],
    ];
    public static function getQuery(): array
    {
        $t1 = (new self)->getTable();
        return [
            'alias' => $t1,
            'query' => DB::table($t1)->select([
                "$t1.id_$t1 as id",
                "$t1.medicamento",
                "$t1.descripcion",
                "$t1.created_at",
            ]),
        ];
    }
    protected $appends = ['label'];
    public function getLabelAttribute(): string
    {
        return $this->medicamento; // Texto mostrado en combobox
    }
}