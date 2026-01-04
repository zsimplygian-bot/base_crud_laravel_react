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
        'descripcion' => 'nullable|string',
    ];
    protected static $tableColumns = [
        ['ID','id'],
        ['PROCEDIMIENTO','procedimiento'],
        ['DESCRIPCIÓN','descripcion'],
        ['FECHA REGISTRO','created_at'],
    ];
    public static function getQuery(): array
    {
        $t1 = (new self)->getTable();
        return [
            'alias' => $t1,
            'query' => DB::table($t1)->select([
                "$t1.id_$t1 as id",
                "$t1.procedimiento",
                "$t1.descripcion",
                "$t1.created_at",
            ]),
        ];
    }
}
