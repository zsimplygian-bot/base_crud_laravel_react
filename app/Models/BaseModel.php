<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

abstract class BaseModel extends Model
{
    use HasFactory;

    protected $primaryKey;
    public $incrementing = true;

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->primaryKey = 'id_' . $this->getTable(); // PK automática

        if (property_exists(static::class, 'validationRules')) {
            $this->fillable = array_keys(static::$validationRules); // Fillable automático
        }
    }

    public static function getValidationRules(): array
    {
        return static::$validationRules ?? [];
    }

    public static function getColumns(): array
    {
        return array_map(
            fn ($c) => ['header' => $c[0], 'accessor' => $c[1]],
            static::$tableColumns ?? []
        );
    }
}
