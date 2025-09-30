<?php
namespace App\Models;
class VacunaSeguimiento extends BaseSeguimiento
{
    protected $table = 'vacuna_seguimiento';
    protected $primaryKey = 'id_vacuna_seguimiento';
    protected $parentForeignKey = 'id_vacuna';
    protected $fillable = [
        'id_vacuna',
        'detalle',
        'tratamiento',
        'observaciones',
        'fecha',
        'creater_id',
    ];
    public function parent()
    {
        return $this->belongsTo(Vacuna::class, $this->parentForeignKey, 'id');
    }
}