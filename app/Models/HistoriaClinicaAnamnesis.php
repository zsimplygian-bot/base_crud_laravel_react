<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class HistoriaClinicaAnamnesis extends BaseModel
{
    use HasFactory;
    protected $table = 'historia_clinica_anamnesis';
    protected $primaryKey = 'id_historia_clinica_anamnesis';
    protected $parentForeignKey = 'id_historia_clinica';
    protected $fillable = [
        'id_historia_clinica',
        'fecha',
        'hora',
        'temperatura',
        'frecuencia_cardiaca',
        'frecuencia_respiratoria',
        'tiempo_llenado_capilar',
        'creater_id',
    ];
    protected static $simpleModalFormFieldDefinitions = [
        ['fecha', 'FECHA', 'date',  3, 'required'],
        ['hora', 'HORA', 'time',  3, 'required'],
        ['temperatura', 'TEMPERATURA (°C)', 'number',  3, 'required'],
        ['frecuencia_cardiaca', 'FRECUENCIA CARDÍACA (lpm)', 'number',  3, 'required'],
        ['frecuencia_respiratoria', 'FRECUENCIA RESPIRATORIA (rpm)', 'number',  3, 'required'],
        ['tiempo_llenado_capilar', 'TIEMPO DE LLENADO CAPILAR (seg)', 'number',  3, 'required'],
    ];
    public function parent()
    {
        return $this->belongsTo(HistoriaClinica::class, $this->parentForeignKey, 'id');
    }
}