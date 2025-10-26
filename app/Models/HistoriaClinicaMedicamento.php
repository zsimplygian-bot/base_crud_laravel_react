<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class HistoriaClinicaMedicamento extends BaseModel
{
    use HasFactory;
    protected $table = 'historia_clinica_medicamento';
    protected $primaryKey = 'id_historia_clinica_medicamento';
    protected $parentForeignKey = 'id_historia_clinica';
    protected $fillable = [
        'id_historia_clinica',
        'id_medicamento',
        'dosis',
        'precio',
        'fecha',
        'creater_id',
    ];
    protected static $simpleModalFormFieldDefinitions = [
        ['id_medicamento', 'MEDICAMENTO', 'select',  3, 'required'],
        ['dosis', 'DOSIS', 'text',   3, 'required'],
        ['precio', 'PRECIO S/', 'number',  3, 'required'],
        ['fecha', 'FECHA', 'date', 3,'required'],
    ];
    protected $appends = ['nombre_medicamento'];
    public function medicamento()
    {
        return $this->belongsTo(Medicamento::class, 'id_medicamento');
    }
    public function getNombreMedicamentoAttribute()
    {
        return $this->medicamento->medicamento ?? null;
    }
    public function parent()
    {
        return $this->belongsTo(HistoriaClinica::class, $this->parentForeignKey, 'id');
    }
}