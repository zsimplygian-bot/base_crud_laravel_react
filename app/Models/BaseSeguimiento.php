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

    public static function getModalFields(): array
    {
        $instance = new static();
        $fields = [];
        $lista = new \App\Models\Lista();

        foreach ($instance->getFillable() as $field) {
            if ($field === $instance->parentForeignKey || $field === 'creater_id') continue;

            $label = strtoupper(str_replace('_', ' ', $field));
            $type = 'text';
            $options = [];

            // 🔹 Detectar tipos automáticamente según nombre del campo
            if (str_contains($field, 'fecha')) {
                $type = 'date';
            } elseif (str_contains($field, 'precio') || str_contains($field, 'monto') || str_contains($field, 'duracion')) {
                $type = 'number';
            }

            // 🔹 Si el campo pertenece a una lista, usar select
            $claveNormalizada = preg_match('/^id_/', $field) ? substr($field, 3) : $field;
            $permitidas = $lista::getTablasPermitidas();
            $especiales = (new \ReflectionClass($lista))->getStaticProperties()['listasEspeciales'];

            if (in_array($claveNormalizada, $permitidas, true) || array_key_exists($field, $especiales)) {
                $type = 'select';
                $resultado = $lista->getListaDinamica($claveNormalizada);
                if ($resultado['success'] && !empty($resultado['data'])) {
                    $options = $resultado['data'];
                }
            }

            $fields[] = $type === 'select'
                ? [$field, $label, $type, $options]
                : [$field, $label, $type];
        }

        return $fields;
    }
}
