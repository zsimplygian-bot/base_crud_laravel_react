<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HistoriaClinica extends BaseModel
{
    use HasFactory;
    protected $table = 'historia_clinica';
    public function seguimientos(): HasMany
    {
        return $this->hasMany(HistoriaClinicaSeguimiento::class, 'id_historia_clinica');
    }
    public static string $title = 'Historias Clínicas';
    protected static $simpleFormFieldDefinitions = [
        ['id_mascota', 'DUEÑO - MASCOTA', 'select'],
        ['fecha', 'FECHA', 'date'],
        ['sintomas', 'SÍNTOMAS', 'text'],
        ['diagnostico', 'DIAGNÓSTICO', 'textarea'],
        ['tratamiento', 'TRATAMIENTO', 'textarea'],
        ['precio', 'PRECIO', 'number'],
        ['observaciones', 'OBSERVACIONES', 'textarea'],
        ['id_estado_historia_clinica', 'ESTADO HISTORIA', 'select'],
    ];
    protected static $validationRules = [
        'id_mascota' => 'required|int',
        'fecha' => 'required|date',
        'sintomas' => 'nullable|string',
        'diagnostico' => 'nullable|string',
        'tratamiento' => 'nullable|string',
        'precio' => 'required|numeric',
        'observaciones' => 'nullable|string',
        'id_estado_historia_clinica' => 'required|int',
    ];
    protected static $toolbarfieldDefinitions = [
        'id_mascota' => ['label' => 'DUEÑO - MASCOTA', 'type' => 'select', 'width' => 3],
        'id_estado_historia_clinica' => ['label' => 'ESTADO HISTORIA', 'type' => 'select', 'width' => 2],
    ];
    public static array $allowedFilters = ['id_mascota', 'id_estado_historia_clinica'];
    protected static $footerfieldDefinitions = [
        'precio' => [ 'label' => 'Total', 'type' => 'text', 'width' => 2],
    ];
    protected static $tableColumns = [
        ['ID', 'id'],
        ['DUEÑO', 'cliente'],
        ['MASCOTA', 'mascota'],
        ['FECHA', 'fecha'],
        ['SÍNTOMAS', 'sintomas'],
        ['DIAGNÓSTICO', 'diagnostico'],
        ['TRATAMIENTO', 'tratamiento'],
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
        $alias = (new self)->getTable();
        $alias2 = 'mascota';
        $alias3 = 'cliente';
        $alias4 = 'estado_historia_clinica';
        $query = DB::table($alias)
            ->leftJoin($alias2, "{$alias}.id_{$alias2}", '=', "{$alias2}.id_{$alias2}")
            ->leftJoin($alias3, "{$alias2}.id_{$alias3}", '=', "{$alias3}.id_{$alias3}")
            ->leftJoin($alias4, "{$alias}.id_{$alias4}", '=', "{$alias4}.id_{$alias4}")
            ->select([
                "{$alias}.id_{$alias} as id",
                "{$alias2}.mascota as mascota",
                "{$alias3}.cliente as cliente",
                "{$alias}.fecha",
                "{$alias}.sintomas",
                "{$alias}.diagnostico",
                "{$alias}.tratamiento",
                "{$alias}.precio",
                "{$alias}.observaciones",
                "{$alias4}.estado_historia_clinica as estado_historia_clinica",
                "{$alias}.created_at",
            ]);
        return ['query' => $query, 'alias' => $alias];
    }
}