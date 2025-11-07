<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;
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
    public function historia_anamnesis(): HasMany
    {
        return $this->hasMany(HistoriaClinicaAnamnesis::class, 'id_historia_clinica');
    }
    public function motivo_historia()
    {
        return $this->belongsTo(MotivoHistoriaClinica::class, 'id_motivo_historia_clinica');
    }
    public function mascota()
    {
        return $this->belongsTo(Mascota::class, 'id_mascota', 'id_mascota');
    }
    public function estado_historia_clinica()
    {
        return $this->belongsTo(EstadoHistoriaClinica::class, 'id_estado_historia_clinica', 'id_estado_historia_clinica');
    }
    // 🔹 Configuración general
    public static string $title = 'Historias Clínicas';
    protected static $simpleFormFieldDefinitions = [
        ['id_mascota', 'MASCOTA - DUEÑO', 'select', 'required'],
        ['fecha', 'FECHA', 'date', 'required'],
        ['id_motivo_historia_clinica', 'MOTIVO HISTORIA', 'select', 'required'],
        ['detalle', 'DETALLE HISTORIA', 'textarea'],
        ['observaciones', 'OBSERVACIONES', 'textarea'],
        ['id_estado_historia_clinica', 'ESTADO HISTORIA', 'select'],
    ];
    public static function getFieldDefinitions(string $type, string $action = null, $data = null): array
    {
        $defs = parent::getFieldDefinitions($type, $action, $data);
        if ($action === 'create' && isset($defs['id_estado_historia_clinica'])) {
            $defs['id_estado_historia_clinica']['type'] = 'hidden';
            $defs['id_estado_historia_clinica']['value'] = 1;
        }
        return $defs;
    }
    protected static $validationRules = [
        'id_mascota' => 'required|int',
        'fecha' => 'required|date',
        'id_motivo_historia_clinica' => 'required|int',
        'detalle' => 'nullable|string',
        'observaciones' => 'nullable|string',
        'id_estado_historia_clinica' => 'required|int',
    ];
    protected static $simpleToolbarFieldDefinitions = [
        ['id_mascota', 'MASCOTA - DUEÑO', 'select'],
        ['id_motivo_historia_clinica', 'MOTIVO', 'select'],
        ['id_estado_historia_clinica', 'ESTADO', 'select'],
    ];
    protected static $simpleFooterFieldDefinitions = [
        ['precio', 'TOTAL', 'text', 1],
    ];
    public static array $allowedFilters = ['id_mascota', 'id_estado_historia_clinica'];
    // Consulta principal
    public static function getQuery()
    {
        $alias = (new self)->getTable();
        $alias2 = 'mascota';
        $alias3 = 'cliente';
        $alias4 = 'estado_historia_clinica';
        $aliasMotivo = 'motivo_historia_clinica';
        $procedimientoTable = 'historia_clinica_procedimiento';
        $medicamentoTable = 'historia_clinica_medicamento';
        $query = DB::table($alias)
            ->leftJoin($alias2, "{$alias}.id_{$alias2}", '=', "{$alias2}.id_{$alias2}")
            ->leftJoin($alias3, "{$alias2}.id_{$alias3}", '=', "{$alias3}.id_{$alias3}")
            ->leftJoin($alias4, "{$alias}.id_{$alias4}", '=', "{$alias4}.id_{$alias4}")
            ->leftJoin($aliasMotivo, "{$alias}.id_motivo_historia_clinica", '=', "{$aliasMotivo}.id_motivo_historia_clinica")
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
                "{$alias4}.estado_historia_clinica as estado",
                "{$alias}.created_at",
                DB::raw("COALESCE(SUM(p.precio),0) + COALESCE(SUM(m.precio),0) as precio"),
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
    protected static $tableColumns = [
        ['ID', 'id'],
        ['MASCOTA', 'mascota'],
        ['DUEÑO', 'cliente'],
        ['FECHA', 'fecha'],
        ['MOTIVO', 'motivo_historia_clinica'],
        ['DETALLE', 'detalle'],
        ['TOTAL', 'precio'],
        ['OBSERVACIONES', 'observaciones'],
        ['ESTADO', 'estado'],
        ['FECHA REGISTRO', 'created_at'],
    ];
}