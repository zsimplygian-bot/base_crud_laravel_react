<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class HistoriaClinicaAnamnesis extends BaseModel
{
    use HasFactory;
    protected $table = 'historia_clinica_anamnesis';
    public static string $title = 'Anamnesis';
    protected static $simpleModalFormFieldDefinitions = [
        ['id_historia_clinica', 'HISTORIA', 'text'],
        ['fecha', 'FECHA', 'date', 'required'],
        ['hora', 'HORA', 'time'],
        ['temperatura', 'TEMPERATURA (°C)', 'number'],
        ['frecuencia_cardiaca', 'FRECUENCIA CARDIACA (lpm)', 'number'],
        ['frecuencia_respiratoria', 'FRECUENCIA RESPIRATORIA (rpm)', 'number'],
        ['tiempo_llenado_capilar', 'TIEMPO LLENADO CAPILAR (seg)', 'number'],
        ['peso', 'PESO (kg)', 'number'],
    ];
    protected static $validationRules = [
        'id_historia_clinica' => 'required|integer|exists:historia_clinica,id_historia_clinica',
        'fecha' => 'required|date',
        'hora' => 'nullable|string|max:10',
        'temperatura' => 'nullable|integer',
        'frecuencia_cardiaca' => 'nullable|integer',
        'frecuencia_respiratoria' => 'nullable|integer',
        'tiempo_llenado_capilar' => 'nullable|integer',
        'peso' => 'nullable|integer',
    ];
    public static function getQuery() {
        $t1 = (new self)->getTable();
        $query = DB::table($t1)->select([
                "$t1.id_$t1",
                "$t1.id_historia_clinica",
                "$t1.fecha",
                "$t1.hora",
                "$t1.temperatura",
                "$t1.frecuencia_cardiaca",
                "$t1.frecuencia_respiratoria",
                "$t1.tiempo_llenado_capilar",
                "$t1.peso",
                "$t1.created_at",
            ]);
        return ['query' => $query, 'alias' => $t1];
    }
    protected static $tableColumns = [
        ['ID', 'id_historia_clinica_anamnesis'],
        ['HISTORIA CLINICA', 'id_historia_clinica'],
        ['FECHA', 'fecha'],
        ['HORA', 'hora'],
        ['TEMPERATURA (°C)', 'temperatura'],
        ['FRECUENCIA CARDIACA (lpm)', 'frecuencia_cardiaca'],
        ['FRECUENCIA RESPIRATORIA (rpm)', 'frecuencia_respiratoria'],
        ['TIEMPO LLENADO CAPILAR (seg)', 'tiempo_llenado_capilar'],
        ['PESO (kg)', 'peso'],
        ['FECHA REGISTRO', 'created_at'],
    ];
    public function parent() { return $this->belongsTo(HistoriaClinica::class, $this->parentForeignKey, 'id'); }
}