<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class HistoriaClinicaSeguimiento extends BaseModel
{
    use HasFactory;
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
    protected static $simpleModalFormFieldDefinitions = [
        ['detalle', 'DETALLE', 'textarea',  3,'required', ],
        ['observaciones', 'OBSERVACIONES', 'textarea',  3],
        ['fecha', 'FECHA', 'date',  3, 'required'],
    ];
    public function parent()
    {
        return $this->belongsTo(HistoriaClinica::class, $this->parentForeignKey, 'id');
    }
}