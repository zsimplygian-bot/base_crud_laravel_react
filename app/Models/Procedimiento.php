<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;

class Procedimiento extends BaseModel
{
    use HasFactory;

    protected $table = 'procedimiento';
    public static string $title = 'Procedimientos';

    protected static $simpleFormFieldDefinitions = [
        ['procedimiento', 'PROCEDIMIENTO', 'text'],
        ['descripcion', 'DESCRIPCIÓN', 'textarea'],
    ];

    protected static $validationRules = [
        'procedimiento' => 'required|string|max:255',
        'descripcion' => 'nullable|string',
    ];

    protected static $tableColumns = [
        ['ID', 'id'],
        ['PROCEDIMIENTO', 'procedimiento'],
        ['DESCRIPCIÓN', 'descripcion'],
        ['FECHA REGISTRO', 'created_at'],
    ];

    public static function getQuery()
    {
        $alias = (new self)->getTable();
        $query = DB::table($alias)
            ->select([
                "{$alias}.id_procedimiento as id",
                "{$alias}.procedimiento",
                "{$alias}.descripcion",
                "{$alias}.created_at",
            ]);
        return ['query' => $query, 'alias' => $alias];
    }
}
