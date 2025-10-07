<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Relations\HasMany;
class HistoriaClinica extends BaseModel
{
    use HasFactory;
    protected $table = 'historia_clinica';
    public function historia_seguimientos(): HasMany
    {
        return $this->hasMany(HistoriaClinicaSeguimiento::class, 'id_historia_clinica');
    }
    public static string $title = 'Historias Clínicas';
    protected static $simpleFormFieldDefinitions = [
        ['id_mascota', 'MASCOTA - DUEÑO', 'select'],
        ['fecha', 'FECHA', 'date'],
        ['temperatura', 'TEMPERATURA (C°)', 'number'],
        ['frecuencia_cardiaca', 'FRECUENCIA CARDIACA (bpm)', 'number'],
        ['frecuencia_respiratoria', 'FRECUENCIA RESPIRATORIA (rpm)', 'number'],
        ['tiempo_llenado_capilar', 'TIEMPO LLENADO CAPILAR (s)', 'number'],
        ['sintomas', 'SÍNTOMAS', 'textarea'],
        ['diagnostico', 'DIAGNÓSTICO', 'textarea'],
        ['observaciones', 'OBSERVACIONES', 'textarea'],
        ['id_estado_historia_clinica', 'ESTADO HISTORIA', 'select'],
    ];
    protected static $validationRules = [
        'id_mascota' => 'required|int',
        'fecha' => 'required|date',
        'temperatura' => 'nullable|int',
        'frecuencia_cardiaca' => 'nullable|int',
        'frecuencia_respiratoria' => 'nullable|int',
        'tiempo_llenado_capilar' => 'nullable|int',
        'sintomas' => 'nullable|string',
        'diagnostico' => 'nullable|string',
        'observaciones' => 'nullable|string',
        'id_estado_historia_clinica' => 'required|int',
    ];
    protected static $toolbarfieldDefinitions = [
        'id_mascota' => ['label' => 'MASCOTA - DUEÑO', 'type' => 'select', 'width' => 3],
        'id_estado_historia_clinica' => ['label' => 'ESTADO HISTORIA', 'type' => 'select', 'width' => 2],
    ];
    public static array $allowedFilters = ['id_mascota', 'id_estado_historia_clinica'];
    protected static $footerfieldDefinitions = [
        'precio' => ['label' => 'Total', 'type' => 'text', 'width' => 2],
    ];
    protected static $tableColumns = [
        ['ID', 'id'],
        ['DUEÑO', 'cliente'],
        ['MASCOTA', 'mascota'],
        ['SEG', 'seguimiento'],
        ['FECHA', 'fecha'],
        ['SÍNTOMAS', 'sintomas'],
        ['DIAGNÓSTICO', 'diagnostico'],
        //['TRATAMIENTO', 'tratamiento'],
        ['PRECIO', 'precio'],
        ['OBSERVACIONES', 'observaciones'],
        ['ESTADO HISTORIA', 'estado_historia_clinica'],
        ['FECHA REGISTRO', 'created_at'],
    ];
    protected static array $apiConfig = [
        //'inputKey' => 'sintomas',
        'endpoint' => 'diagnostico',
        'type' => 'text',
        'fields' => [
            'diagnostico' => 'diagnostico',
        ],
        'emptyValue' => '-',
    ];
    public static function getQuery()
    {
        $alias = (new self)->getTable(); // historia_clinica
        $alias2 = 'mascota';
        $alias3 = 'cliente';
        $alias4 = 'estado_historia_clinica';
        $seguimientoTable = 'historia_clinica_seguimiento';
        $query = DB::table($alias)
            ->leftJoin($alias2, "{$alias}.id_{$alias2}", '=', "{$alias2}.id_{$alias2}")
            ->leftJoin($alias3, "{$alias2}.id_{$alias3}", '=', "{$alias3}.id_{$alias3}")
            ->leftJoin($alias4, "{$alias}.id_{$alias4}", '=', "{$alias4}.id_{$alias4}")
            ->leftJoin($seguimientoTable . ' as s', "s.id_{$alias}", '=', "{$alias}.id_{$alias}") 
            ->select([
                "{$alias}.id_{$alias} as id",
                "{$alias2}.mascota as mascota",
                "{$alias3}.cliente as cliente",
                "{$alias}.fecha",
                "{$alias}.sintomas",
                "{$alias}.diagnostico",
                "{$alias}.tratamiento",
                DB::raw("COALESCE(SUM(s.precio), 0) as precio"),
                "{$alias}.observaciones",
                "{$alias4}.estado_historia_clinica as estado_historia_clinica",
                "{$alias}.created_at",
                DB::raw("CASE WHEN COUNT(s.id_historia_clinica_seguimiento) > 0 THEN 'SI' ELSE 'NO' END as seguimiento"),
            ])
            ->groupBy(
                "{$alias}.id_{$alias}",
                "{$alias2}.mascota",
                "{$alias3}.cliente",
                "{$alias}.fecha",
                "{$alias}.sintomas",
                "{$alias}.diagnostico",
                "{$alias}.tratamiento",
                "{$alias}.observaciones",
                "{$alias4}.estado_historia_clinica",
                "{$alias}.created_at"
            );

        return ['query' => $query, 'alias' => $alias];
    }
}