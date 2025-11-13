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
    ];
    protected static $validationRules = [
        'id_historia_clinica' => 'required|integer|exists:historia_clinica,id_historia_clinica',
        'fecha' => 'required|date',
        'hora' => 'nullable|string|max:10',
        'temperatura' => 'nullable|integer',
        'frecuencia_cardiaca' => 'nullable|integer',
        'frecuencia_respiratoria' => 'nullable|integer',
        'tiempo_llenado_capilar' => 'nullable|integer',
    ];
    protected static $tableColumns = [
        ['ID', 'id_historia_clinica_anamnesis'],
        ['HISTORIA CLINICA', 'id_historia_clinica'],
        ['FECHA', 'fecha'],
        ['HORA', 'hora'],
        ['TEMPERATURA (°C)', 'temperatura'],
        ['FRECUENCIA CARDIACA (lpm)', 'frecuencia_cardiaca'],
        ['FRECUENCIA RESPIRATORIA (rpm)', 'frecuencia_respiratoria'],
        ['TIEMPO LLENADO CAPILAR (seg)', 'tiempo_llenado_capilar'],
        ['FECHA REGISTRO', 'created_at'],
    ];
    public static function getQuery()
    {
        $al1 = (new self)->getTable();
        $query = DB::table($al1)
            ->select([
                "{$al1}.id_historia_clinica_anamnesis",
                "{$al1}.id_historia_clinica",
                "{$al1}.fecha",
                "{$al1}.hora",
                "{$al1}.temperatura",
                "{$al1}.frecuencia_cardiaca",
                "{$al1}.frecuencia_respiratoria",
                "{$al1}.tiempo_llenado_capilar",
                "{$al1}.created_at",
            ]);
        return ['query' => $query, 'alias' => $al1];
    }
    public function parent()
    {
        return $this->belongsTo(HistoriaClinica::class, $this->parentForeignKey, 'id');
    }
}