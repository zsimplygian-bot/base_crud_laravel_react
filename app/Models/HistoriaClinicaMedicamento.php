<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class HistoriaClinicaMedicamento extends BaseSeguimiento
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

    // 👇 1️⃣ Relación con Medicamento
    public function medicamento()
    {
        return $this->belongsTo(Medicamento::class, 'id_medicamento');
    }

    // 👇 2️⃣ Accessor para obtener automáticamente el nombre del medicamento
    protected $appends = ['nombre_medicamento'];

    public function getNombreMedicamentoAttribute()
    {
        return $this->medicamento->medicamento ?? null;
    }

    // 👇 3️⃣ Campos personalizados del formulario
    public static function getCustomFields(): array
    {
        return [
            ['id_medicamento', 'MEDICAMENTO', 'select'],
            ['dosis', 'DOSIS', 'text'],
            ['precio', 'PRECIO S/', 'number'],
            ['fecha', 'FECHA', 'date'],
        ];
    }


    // 👇 4️⃣ Relación con la historia clínica (ya la tenías)
    public function parent()
    {
        return $this->belongsTo(HistoriaClinica::class, $this->parentForeignKey, 'id');
    }
}
