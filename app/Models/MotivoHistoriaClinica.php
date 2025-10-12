<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MotivoHistoriaClinica extends Model
{
    use HasFactory;

    protected $table = 'motivo_historia_clinica'; // Nombre de la tabla
    protected $primaryKey = 'id_motivo_historia_clinica'; // Ajusta según tu DB
    public $timestamps = false; // Si no tienes created_at / updated_at

    protected $fillable = [
        'motivo_historia_clinica',
    ];

    // Relación inversa: una historia pertenece a un motivo
    public function historias(): HasMany
    {
        return $this->hasMany(HistoriaClinica::class, 'id_motivo_historia_clinica');
    }
}
