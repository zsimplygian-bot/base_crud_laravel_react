<?php
namespace App\Models\Traits;
trait HasCrudModel
{
    public function initializeHasCrudModel()
    {
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
            fn($c) => ['header' => $c[0], 'accessor' => $c[1]],
            static::$tableColumns ?? []
        );
    }
}