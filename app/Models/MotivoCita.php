<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class MotivoCita extends BaseModel
{
    use HasFactory;
    protected $table = 'motivo_cita';
    public static string $title = 'Motivo cita';
    protected static $simpleFormFieldDefinitions = [
        ['motivo_cita', 'Motivo cita', 'text'],
    ];
    protected static $validationRules = [
        'motivo_cita' => 'required|string|max:100',
    ];
    public static function getQuery()
    {
        $alias = (new self)->getTable();
        $query = DB::table($alias)
            ->select([
                "{$alias}.id_{$alias} as id",
                "{$alias}.{$alias}",
            ]);
        return ['query' => $query, 'alias' => $alias];
    }
    protected static $tableColumns = [
        ['ID', 'id'],
        ['MOTIVO CITA', 'motivo_cita'],
    ];

}