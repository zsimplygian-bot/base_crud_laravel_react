<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class MotivoHistoriaClinica extends BaseModel
{
    use HasFactory;
    protected $table = 'motivo_historia_clinica';
    protected static $validationRules = [
        'motivo_historia_clinica' => 'required|string|max:100',
    ];
    protected static $tableColumns = [
        ['ID','id'],
        ['MOTIVO HISTORIA CLÍNICA','motivo_historia_clinica'],
    ];
    public static function getQuery(): array
    {
        $t1 = (new self)->getTable();
        return [
            'alias' => $t1,
            'query' => DB::table($t1)->select([
                "$t1.id_$t1 as id",
                "$t1.motivo_historia_clinica",
            ]),
        ];
    }
}
