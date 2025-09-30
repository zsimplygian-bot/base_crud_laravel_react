<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Cita extends BaseModel
{
    use HasFactory;
    protected $table = 'cita';
    public function cita_seguimientos(): HasMany
    {
        return $this->hasMany(CitaSeguimiento::class, 'id_cita');
    }
    public static string $title = 'Citas';
    protected static $simpleFormFieldDefinitions = [
        ['id_mascota', 'DUEÑO - MASCOTA', 'select'],
        ['fecha', 'FECHA', 'date'],
        ['hora', 'HORA', 'time'],
        ['id_motivo_cita', 'MOTIVO', 'select'],
        ['precio', 'PRECIO S/.', 'number'],
        ['observaciones', 'OBSERVACIONES', 'textarea'],
        ['id_estado_cita', 'ESTADO', 'select'],
    ];
    protected static $validationRules = [
        'id_mascota' => 'required|int',
        'fecha' => 'required|date',
        'hora' => 'required',
        'id_motivo_cita' => 'required|int',
        'precio' => 'required|numeric',
        'id_estado_cita' => 'required|int',
    ];
    protected static $toolbarfieldDefinitions = [
        'id_mascota' => ['label' => 'DUEÑO - MASCOTA', 'type' => 'select', 'width' => 3],
        'id_motivo_cita' => ['label' => 'MOTIVO CITA', 'type' => 'select', 'width' => 2],
        'id_estado_cita' => ['label' => 'ESTADO CITA', 'type' => 'select', 'width' => 2],
    ];
    public static array $allowedFilters = ['id_mascota', 'id_motivo_cita', 'id_estado_cita'];
    protected static $footerfieldDefinitions = [
        'precio' => [ 'label' => 'Total', 'type' => 'text', 'width' => 2],
    ];
    protected static $tableColumns = [
        ['ID', 'id'],
        ['MASCOTA', 'mascota'],
        ['DUEÑO', 'cliente'],
        ['FECHA', 'fecha'],
        ['HORA', 'hora'],
        ['MOTIVO', 'motivo_cita'],
        ['PRECIO', 'precio'],
        ['ESTADO', 'estado_cita'],
        ['FECHA REGISTRO', 'created_at'],
    ];
    public static function getQuery()
    {
        $alias = (new self)->getTable();
        $alias2 = 'mascota';
        $alias3 = 'estado_cita';
        $alias4 = 'motivo_cita';
        $alias5 = 'cliente';
        $query = DB::table($alias)
            ->leftJoin($alias2, "{$alias}.id_{$alias2}", '=', "{$alias2}.id_{$alias2}")
            ->leftJoin($alias3, "{$alias}.id_{$alias3}", '=', "{$alias3}.id_{$alias3}")
            ->leftJoin($alias4, "{$alias}.id_{$alias4}", '=', "{$alias4}.id_{$alias4}")
            ->leftJoin($alias5, "{$alias2}.id_{$alias5}", '=', "{$alias5}.id_{$alias5}")
            ->select([
                "{$alias}.id_{$alias} as id",
                "{$alias2}.mascota as mascota",
                "{$alias5}.cliente as cliente",
                "{$alias}.fecha",
                "{$alias}.hora",
                "{$alias4}.motivo_cita",
                "{$alias}.precio",
                "{$alias3}.estado_cita",
                "{$alias}.created_at",
            ]);
        return ['query' => $query, 'alias' => $alias];
    }
}