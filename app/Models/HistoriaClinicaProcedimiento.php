<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class HistoriaClinicaProcedimiento extends BaseModel
{
    use HasFactory;
    protected $table = 'historia_clinica_procedimiento';
    protected $primaryKey = 'id_historia_clinica_procedimiento';
    protected $parentForeignKey = 'id_historia_clinica';
    protected $fillable = [
        'id_historia_clinica',
        'id_procedimiento',
        'detalle',
        'precio',
        'fecha',
        'creater_id',
    ];
    protected static $simpleModalFormFieldDefinitions = [
        ['id_procedimiento', 'PROCEDIMIENTO', 'select',  3, 'required',],
        ['detalle', 'DETALLE', 'textarea', 3],  
        ['precio', 'PRECIO S/', 'number' ,  3,'required'],
        ['fecha', 'FECHA', 'date',  3, 'required'],
    ];
    protected $appends = ['nombre_procedimiento'];
    public function procedimiento()
    {
        return $this->belongsTo(Procedimiento::class, 'id_procedimiento');
    }
    public function getNombreProcedimientoAttribute()
    {
        return $this->procedimiento->procedimiento ?? null;
    }
    public function parent()
    {
        return $this->belongsTo(HistoriaClinica::class, $this->parentForeignKey, 'id');
    }
}