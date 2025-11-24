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
    public static function getQuery() {
        $t1 = (new self)->getTable();
        $query = DB::table($t1)->select([
                "$t1.id_$t1 as id",
                "$t1.$t1",
            ]);
        return ['query' => $query, 'alias' => $t1];
    }
    protected static $tableColumns = [
        ['ID', 'id'],
        ['MOTIVO HISTORIA CLÍNICA', 'motivo_historia_clinica'],
    ];
}