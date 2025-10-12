<?php
namespace App\Models;
class HistoriaClinicaAnamnesis extends BaseSeguimiento
{
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
    public function parent()
    {
        return $this->belongsTo(HistoriaClinica::class, $this->parentForeignKey, 'id');
    }
    public static function getCustomFields(): array
    {
        return [
            ['fecha', 'FECHA', 'date'],
            ['hora', 'HORA', 'time'],
            ['temperatura', 'TEMPERATURA (°C)', 'number'],
            ['frecuencia_cardiaca', 'FRECUENCIA CARDÍACA (lpm)', 'number'],
            ['frecuencia_respiratoria', 'FRECUENCIA RESPIRATORIA (rpm)', 'number'],
            ['tiempo_llenado_capilar', 'TIEMPO DE LLENADO CAPILAR (seg)', 'number'],
        ];
    }
}