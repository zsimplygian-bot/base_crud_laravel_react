<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoriaClinicaSeguimiento extends Model
{
    use HasFactory;

    protected $table = 'historia_clinica_seguimiento';
    protected $primaryKey = 'id_historia_clinica_seguimiento';

    protected $fillable = [
        'id_historia_clinica',
        'detalle',
        'tratamiento',
        'observaciones',
        'fecha',
        'creater_id',
    ];

    // Mapea id para Ziggy
    protected $appends = ['id'];

    public function getIdAttribute()
    {
        return $this->attributes['id_historia_clinica_seguimiento'];
    }

    public function historiaClinica()
    {
        return $this->belongsTo(HistoriaClinica::class, 'id_historia_clinica', 'id');
    }
}
