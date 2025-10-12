<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class HistoriaClinicaProcedimiento extends BaseSeguimiento
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

    // 👇 1️⃣ Relación con Procedimiento (suponiendo que tienes un modelo Procedimiento)
    public function procedimiento()
    {
        return $this->belongsTo(Procedimiento::class, 'id_procedimiento');
    }

    // 👇 2️⃣ Accessor para obtener automáticamente el nombre del procedimiento
    protected $appends = ['nombre_procedimiento'];

    public function getNombreProcedimientoAttribute()
    {
        return $this->procedimiento->procedimiento ?? null; // ajusta "nombre" según tu columna real en Procedimiento
    }

    // 👇 3️⃣ Campos personalizados del formulario
    public static function getCustomFields(): array
    {
        return [
            ['id_procedimiento', 'PROCEDIMIENTO', 'select'], // el select puede usar nombre_procedimiento como label
            ['detalle', 'DETALLE', 'textarea'],
            ['precio', 'PRECIO S/', 'number'],
            ['fecha', 'FECHA', 'date'],
        ];
    }

    // 👇 4️⃣ Relación con la historia clínica
    public function parent()
    {
        return $this->belongsTo(HistoriaClinica::class, $this->parentForeignKey, 'id');
    }
}
