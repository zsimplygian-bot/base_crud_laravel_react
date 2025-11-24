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
    public static function getQuery() {
        $t1 = (new self)->getTable();
        $query = DB::table($t1)->select([
                "$t1.id_$t1 as id",
                "$t1.procedimiento",
                "$t1.descripcion",
                "$t1.created_at",
            ]);
        return ['query' => $query, 'alias' => $t1];
    }
    protected static $tableColumns = [
        ['ID', 'id'],
        ['PROCEDIMIENTO', 'procedimiento'],
        ['DESCRIPCIÓN', 'descripcion'],
        ['FECHA REGISTRO', 'created_at'],
    ];
}