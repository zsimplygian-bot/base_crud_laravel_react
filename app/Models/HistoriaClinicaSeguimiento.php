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
        'tratamiento',
        'observaciones',
        'precio',
        'fecha',
        'creater_id',
    ];
    public function parent()
    {
        return $this->belongsTo(HistoriaClinica::class, $this->parentForeignKey, 'id');
    }
    /**
     * Campos personalizados tipo simple: [field, LABEL, type]
     */
    public static function getCustomFields(): array
    {
        return [
            ['detalle', 'DETALLE', 'textarea'],
            ['tratamiento', 'TRATAMIENTO', 'textarea'],
            ['observaciones', 'OBSERVACIONES', 'textarea'],
            ['precio', 'PRECIO S/', 'text'],
            ['fecha', 'FECHA', 'date'],
        ];
    }
}