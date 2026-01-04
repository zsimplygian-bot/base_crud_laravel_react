<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class MotivoCita extends BaseModel
{
    use HasFactory;
    protected $table = 'motivo_cita';
    protected static $validationRules = [
        'motivo_cita' => 'required|string|max:100',
        'lapso_tiempo' => 'nullable|string|max:100',
    ];
    protected static $tableColumns = [
        ['ID','id'],
        ['MOTIVO CITA','motivo_cita'],
        ['LAPSO DE TIEMPO','lapso_tiempo'],
        ['FECHA REGISTRO','created_at'],
    ];
    public static function getQuery(): array
    {
        $t1 = (new self)->getTable();
        return [
            'alias' => $t1,
            'query' => DB::table($t1)->select([
                "$t1.id_$t1 as id",
                "$t1.motivo_cita",
                "$t1.lapso_tiempo",
                "$t1.created_at",
            ]),
        ];
    }
}
