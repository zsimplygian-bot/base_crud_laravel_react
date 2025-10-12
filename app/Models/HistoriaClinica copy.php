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

    public function historia_procedimientos(): HasMany
    {
        return $this->hasMany(HistoriaClinicaProcedimiento::class, 'id_historia_clinica');
    }

    public function historia_medicamentos(): HasMany
    {
        return $this->hasMany(HistoriaClinicaMedicamento::class, 'id_historia_clinica');
    }

    public function motivo_historia()
    {
        return $this->belongsTo(MotivoHistoriaClinica::class, 'id_motivo_historia_clinica');
    }

    public static string $title = 'Historias Clínicas';

    protected static $simpleFormFieldDefinitions = [
        ['id_mascota', 'MASCOTA - DUEÑO', 'select'],
        ['fecha', 'FECHA', 'date'],
        ['id_motivo_historia_clinica', 'MOTIVO HISTORIA', 'select'],
        ['detalle', 'DETALLE HISTORIA', 'textarea'],
        ['observaciones', 'OBSERVACIONES', 'textarea'],
        ['id_estado_historia_clinica', 'ESTADO HISTORIA', 'select'],
    ];

    protected static $validationRules = [
        'id_mascota' => 'required|int',
        'fecha' => 'required|date',
        'id_motivo_historia_clinica' => 'required|int',
        'detalle' => 'nullable|string',
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
        ['FECHA', 'fecha'],
        ['MOTIVO', 'motivo_historia_clinica'],
        ['DETALLE', 'detalle'],
        ['OBSERVACIONES', 'observaciones'],
        ['ESTADO HISTORIA', 'estado_historia_clinica'],
        ['FECHA REGISTRO', 'created_at'],
        ['TOTAL', 'precio'],
    ];

    public static function getQuery()
    {
        $alias = (new self)->getTable(); // historia_clinica
        $alias2 = 'mascota';
        $alias3 = 'cliente';
        $alias4 = 'estado_historia_clinica';
        $aliasMotivo = 'motivo_historia_clinica';
        $seguimientoTable = 'historia_clinica_seguimiento';
        $procedimientoTable = 'historia_clinica_procedimiento';
        $medicamentoTable = 'historia_clinica_medicamento';

        $query = DB::table($alias)
            ->leftJoin($alias2, "{$alias}.id_{$alias2}", '=', "{$alias2}.id_{$alias2}")
            ->leftJoin($alias3, "{$alias2}.id_{$alias3}", '=', "{$alias3}.id_{$alias3}")
            ->leftJoin($alias4, "{$alias}.id_{$alias4}", '=', "{$alias4}.id_{$alias4}")
            ->leftJoin($aliasMotivo, "{$alias}.id_motivo_historia_clinica", '=', "{$aliasMotivo}.id_motivo_historia_clinica")
            ->leftJoin($seguimientoTable . ' as s', "s.id_{$alias}", '=', "{$alias}.id_{$alias}")
            ->leftJoin($procedimientoTable . ' as p', "p.id_historia_clinica", '=', "{$alias}.id_{$alias}")
            ->leftJoin($medicamentoTable . ' as m', "m.id_historia_clinica", '=', "{$alias}.id_{$alias}")
            ->select([
                "{$alias}.id_{$alias} as id",
                "{$alias2}.mascota as mascota",
                "{$alias3}.cliente as cliente",
                "{$alias}.fecha",
                "{$aliasMotivo}.motivo_historia_clinica as motivo_historia_clinica",
                "{$alias}.detalle",
                "{$alias}.observaciones",
                "{$alias4}.estado_historia_clinica as estado_historia_clinica",
                "{$alias}.created_at",
                DB::raw("COALESCE(SUM(s.precio),0) + COALESCE(SUM(p.precio),0) + COALESCE(SUM(m.precio),0) as precio"),
                
            ])
            ->groupBy(
                "{$alias}.id_{$alias}",
                "{$alias2}.mascota",
                "{$alias3}.cliente",
                "{$alias}.fecha",
                "{$aliasMotivo}.motivo_historia_clinica",
                "{$alias}.detalle",
                "{$alias}.observaciones",
                "{$alias4}.estado_historia_clinica",
                "{$alias}.created_at"
            );

        return ['query' => $query, 'alias' => $alias];
    }
}
