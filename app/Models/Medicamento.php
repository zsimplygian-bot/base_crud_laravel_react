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

    protected static $tableColumns = [
        ['ID', 'id'],
        ['MEDICAMENTO', 'medicamento'],
        ['DESCRIPCIÓN', 'descripcion'],
        ['FECHA REGISTRO', 'created_at'],
    ];

    public static function getQuery()
    {
        $alias = (new self)->getTable();
        $query = DB::table($alias)
            ->select([
                "{$alias}.id_medicamento as id",
                "{$alias}.medicamento",
                "{$alias}.descripcion",
                "{$alias}.created_at",
            ]);
        return ['query' => $query, 'alias' => $alias];
    }

    // 🔹 Esto agrega un campo 'label' al resultado, útil para selects y vistas dinámicas
    protected $appends = ['label'];

    public function getLabelAttribute(): string
    {
        return $this->medicamento;
    }
}
