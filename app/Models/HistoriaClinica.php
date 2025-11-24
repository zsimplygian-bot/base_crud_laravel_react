<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Relations\HasMany;
class HistoriaClinica extends BaseModel
{
    use HasFactory;
    protected $table = 'historia_clinica';
    public static string $title = 'Historias Clínicas';
    protected static $simpleFormFieldDefinitions = [
        ['id_mascota', 'MASCOTA - DUEÑO', 'select', 'required'],
        ['fecha', 'FECHA', 'date', 'required'],
        ['id_motivo_historia_clinica', 'MOTIVO HISTORIA', 'select', 'required'],
        ['detalle', 'DETALLE HISTORIA', 'textarea'],
        ['observaciones', 'OBSERVACIONES', 'textarea'],
        ['id_estado_historia_clinica', 'ESTADO HISTORIA', 'select'],
    ];
    // Sobrescribimos el hook para acción create
    protected static function adjustFieldForAction(array $fieldDef, string $fieldName, ?string $action): array
    {
        if ($fieldName === 'id_estado_historia_clinica' && $action === 'create') {
            $fieldDef['type'] = 'hidden';
            $fieldDef['value'] = 1;
        }
        return $fieldDef;
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
    public static function getQuery() {
        $t1 = (new self)->getTable(); // historia_clinica
        $t2 = 'mascota';
        $t3 = 'cliente';
        $t4 = 'estado_historia_clinica';
        $t5 = 'motivo_historia_clinica';
        $t6 = 'historia_clinica_procedimiento';
        $t7 = 'historia_clinica_medicamento';
        $query = DB::table($t1)
            ->leftJoin($t2, "$t1.id_$t2", '=', "$t2.id_$t2")
            ->leftJoin($t3, "$t2.id_$t3", '=', "$t3.id_$t3")
            ->leftJoin($t4, "$t1.id_$t4", '=', "$t4.id_$t4")
            ->leftJoin($t5, "$t1.id_$t5", '=', "$t5.id_$t5")
            ->leftJoin($t6, "$t6.id_$t1", '=', "$t1.id_$t1")
            ->leftJoin($t7, "$t7.id_$t1", '=', "$t1.id_$t1")
            ->select([
                "$t1.id_$t1 as id",
                "$t2.mascota as mascota",
                "$t3.cliente as cliente",
                "$t1.fecha",
                "$t5.motivo_historia_clinica as motivo_historia_clinica",
                "$t1.detalle",
                "$t1.observaciones",
                "$t4.estado_historia_clinica as estado",
                "$t1.created_at",
                DB::raw("COALESCE(SUM($t6.precio),0) + COALESCE(SUM($t7.precio),0) as precio"),
            ])
            ->groupBy(
                "$t1.id_$t1",
                "$t2.mascota",
                "$t3.cliente",
                "$t1.fecha",
                "$t5.motivo_historia_clinica",
                "$t1.detalle",
                "$t1.observaciones",
                "$t4.estado_historia_clinica",
                "$t1.created_at"
            );
        return ['query' => $query, 'alias' => $t1];
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
    public function historia_seguimientos(): HasMany { return $this->hasMany(HistoriaClinicaSeguimiento::class, 'id_historia_clinica'); }
    public function historia_procedimientos(): HasMany { return $this->hasMany(HistoriaClinicaProcedimiento::class, 'id_historia_clinica'); }
    public function historia_medicamentos(): HasMany { return $this->hasMany(HistoriaClinicaMedicamento::class, 'id_historia_clinica'); }
    public function historia_anamnesis(): HasMany { return $this->hasMany(HistoriaClinicaAnamnesis::class, 'id_historia_clinica'); }
    public function motivo_historia() { return $this->belongsTo(MotivoHistoriaClinica::class, 'id_motivo_historia_clinica'); }
    public function mascota() { return $this->belongsTo(Mascota::class, 'id_mascota'); }
    public function estado_historia_clinica() { return $this->belongsTo(EstadoHistoriaClinica::class, 'id_estado_historia_clinica'); }
}