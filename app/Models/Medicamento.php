<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class Medicamento extends BaseModel
{
    use HasFactory;
    protected $table = 'medicamento';
    public static string $title = 'Medicamentos';
    protected static $simpleFormFieldDefinitions = [
        ['medicamento', 'MEDICAMENTO', 'text'],
        ['descripcion', 'DESCRIPCIÓN', 'textarea'],
    ];
    protected static $validationRules = [
        'medicamento' => 'required|string|max:255',
        'descripcion' => 'nullable|string',
    ];
    
    public static function getQuery() {
        $t1 = (new self)->getTable();
        $query = DB::table($t1)->select([
                "$t1.id_$t1 as id",
                "$t1.medicamento",
                "$t1.descripcion",
                "$t1.created_at",
            ]);
        return ['query' => $query, 'alias' => $t1];
    }
    protected static $tableColumns = [
        ['ID', 'id'],
        ['MEDICAMENTO', 'medicamento'],
        ['DESCRIPCIÓN', 'descripcion'],
        ['FECHA REGISTRO', 'created_at'],
    ];
    protected $appends = ['label'];
    public function getLabelAttribute(): string
    {
        return $this->medicamento;
    }
}