<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class MotivoHistoriaClinica extends BaseModel
{
    use HasFactory;
    protected $table = 'motivo_historia_clinica';
    public static string $title = 'Motivo Historia Clinica';
    protected static $simpleFormFieldDefinitions = [
        ['motivo_historia_clinica', 'MOTIVO HISTORIA CLÍNICA', 'text'],
    ];
    protected static $validationRules = [
        'motivo_historia_clinica' => 'required|string|max:100',
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
        ['MOTIVO HISTORIA CLÍNICA', 'motivo_historia_clinica'],
    ];

}