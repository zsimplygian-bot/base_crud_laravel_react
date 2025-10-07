<?php
namespace App\Models;
class CitaSeguimiento extends BaseSeguimiento
{
    protected $table = 'cita_seguimiento';
    protected $primaryKey = 'id_cita_seguimiento';
    protected $parentForeignKey = 'id_cita';
    protected $fillable = [
        'id_cita',
        'detalle',
        'observaciones',
        'fecha',
        'creater_id',
    ];
    public function parent()
    {
        return $this->belongsTo(Cita::class, $this->parentForeignKey, 'id');
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