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
        ['motivo_cita', 'MOTIVO CITA', 'text'],
        ['lapso_tiempo', 'LAPSO DE TIEMPO', 'text'],
    ];
    protected static $validationRules = [
        'motivo_cita' => 'required|string|max:100',
        'lapso_tiempo' => 'required|string|max:100',
    ];
    public static function getQuery() {
        $t1 = (new self)->getTable();
        $query = DB::table($t1)->select([
                "$t1.id_$t1 as id",
                "$t1.$t1",
                "$t1.lapso_tiempo",
            ]);
        return ['query' => $query, 'alias' => $t1];
    }
    protected static $tableColumns = [
        ['ID', 'id'],
        ['MOTIVO CITA', 'motivo_cita'],
        ['LAPSO DE TIEMPO', 'lapso_tiempo'],
    ];

}