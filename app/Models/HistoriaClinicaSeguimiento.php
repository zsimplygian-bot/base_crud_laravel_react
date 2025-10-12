<?php
namespace App\Models;
class HistoriaClinicaSeguimiento extends BaseSeguimiento
{
    protected $table = 'historia_clinica_seguimiento';
    protected $primaryKey = 'id_historia_clinica_seguimiento';
    protected $parentForeignKey = 'id_historia_clinica';
    protected $fillable = [
        'id_historia_clinica',
        'detalle',
        'observaciones',
        'fecha',
        'creater_id',
    ];
    public function parent()
    {
        return $this->belongsTo(HistoriaClinica::class, $this->parentForeignKey, 'id');
    }
    public static function getCustomFields(): array
    {
        return [
            ['detalle', 'DETALLE', 'textarea'],
            ['observaciones', 'OBSERVACIONES', 'textarea'],
            ['fecha', 'FECHA', 'date'],
        ];
    }
}