<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

abstract class BaseSeguimiento extends Model
{
    use HasFactory;

    /**
     * Llave primaria del seguimiento
     */
    protected $primaryKey = '';

    /**
     * Nombre de la columna FK hacia el modelo padre
     */
    protected $parentForeignKey = '';

    /**
     * Campos fillable del seguimiento
     */
    protected $fillable = [];

    /**
     * Campos que se agregan automáticamente al serializar
     */
    protected $appends = ['id'];

    /**
     * Obtener el ID real del modelo
     */
    public function getIdAttribute()
    {
        return $this->attributes[$this->primaryKey];
    }

    /**
     * Relación hacia el modelo padre
     */
    abstract public function parent();

    /**
     * Devuelve los campos para el modal dinámicamente
     */
    public static function getModalFields(): array
    {
        $instance = new static();
        $fillable = $instance->getFillable();
        $fields = [];

        foreach ($fillable as $field) {
            if ($field === $instance->parentForeignKey || $field === 'creater_id') continue;

            $type = 'text';
            if (str_contains($field, 'fecha')) $type = 'date';
            if (in_array($field, ['detalle', 'tratamiento', 'observaciones'])) $type = 'textarea';

            $fields[] = [
                'name'     => $field,
                'label'    => ucfirst(str_replace('_', ' ', $field)),
                'type'     => $type,
                'required' => in_array($field, ['detalle', 'fecha']),
            ];
        }

        return $fields;
    }
}
