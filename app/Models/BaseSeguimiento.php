<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

abstract class BaseSeguimiento extends Model
{
    use HasFactory;

    protected $primaryKey = '';
    protected $parentForeignKey = '';
    protected $fillable = [];
    protected $appends = ['id'];

    public function getIdAttribute()
    {
        return $this->attributes[$this->primaryKey] ?? null;
    }

    abstract public function parent();

    /**
     * Devuelve los campos del modal dinámicamente según $fillable del hijo
     * Retorna array de arrays tipo: [field, LABEL, type]
     */
    public static function getModalFields(): array
{
    $instance = new static();

    if (method_exists($instance, 'getCustomFields')) {
        $custom = $instance::getCustomFields();
        $fields = [];
        foreach ($custom as $field) {
            if (isset($field['name'])) { // asociativo
                $fields[] = [$field['name'], $field['label'], $field['type']];
            } else { // numérico
                $fields[] = $field;
            }
        }
        return $fields;
    }

    // Si no hay customFields, generamos desde fillable
    $fields = [];
    foreach ($instance->getFillable() as $field) {
        if ($field === $instance->parentForeignKey || $field === 'creater_id') continue;
        $fields[] = [$field, strtoupper(str_replace('_', ' ', $field)), 'text'];
    }

    return $fields;
}

}
