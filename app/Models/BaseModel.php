<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
abstract class BaseModel extends Model
{
    use HasFactory;
    protected $primaryKey;
    public $incrementing = true;
    protected $parentForeignKey = null;
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->primaryKey = 'id_' . $this->getTable();
        if (property_exists(static::class, 'validationRules')) {
            $this->fillable = array_keys(static::$validationRules);
        }
    }
    public static function getApiConfig(): array
    {
        return static::$apiConfig ?? [];
    }
    public static function getValidationRules(): array
    {
        return static::$validationRules ?? [];
    }
    public static function getFormFields($data = null, ?string $action = null): array
    {
        return static::buildFields('formFieldDefinitions', $data, $action);
    }
    public static function getToolbarFields(): array
    {
        return static::buildFields('toolbarFieldDefinitions');
    }
    public static function getFooterFields(): array
    {
        return static::buildFields('footerFieldDefinitions');
    }
    public static function getModalFields($data = null, ?string $action = null): array
    {
        return static::buildFields('modalFormFieldDefinitions', $data, $action);
    }
    protected static function buildFields(string $property, $data = null, ?string $action = null): array
    {
        $definitions = static::resolveFieldDefinitions($property, $action);
        return static::applyFieldMeta($definitions, $data);
    }
    protected static function resolveFieldDefinitions(string $property, ?string $action = null): array
    {
        if (property_exists(static::class, $property) && !empty(static::${$property})) {
            return static::normalizeDefinitions(static::${$property}, $action);
        }
        $simpleProperty = 'simple' . ucfirst($property);
        if (property_exists(static::class, $simpleProperty) && !empty(static::${$simpleProperty})) {
            return static::transformSimple(static::${$simpleProperty}, $action);
        }
        return [];
    }
    protected static function normalizeDefinitions(array $defs, ?string $action = null): array
    {
        return $defs;
    }
    // Transform simple definitions, aplicando hook por acción
    protected static function transformSimple(array $simple, ?string $action = null): array
{
    $result = [];

    foreach ($simple as $item) {
        if (count($item) < 3) continue;

        [$field, $label, $type] = array_slice($item, 0, 3);

        // width siempre tendrá valor (si no viene, será 2)
        $definition = [
            'label' => $label,
            'type'  => $type,
            'width' => isset($item[3]) && is_numeric($item[3]) ? (int)$item[3] : 2,
        ];

        // Procesar el resto de opciones
        foreach (array_slice($item, 3) as $opt) {

            if (is_string($opt)) {

                if (in_array($opt, ['readonly', 'disabled', 'required', 'autofocus', 'hidden'])) {
                    $definition[$opt] = true;
                    continue;
                }

                if (preg_match('/^maxlength:(\d+)$/', $opt, $m)) {
                    $definition['maxlength'] = (int) $m[1];
                    continue;
                }

                if (preg_match('/^placeholder:(.+)$/', $opt, $m)) {
                    $definition['placeholder'] = trim($m[1]);
                    continue;
                }
            }

            if (is_array($opt)) {
                foreach ($opt as $k => $v) {
                    $definition[$k] = $v;
                }
            }
        }

        // Hook para acción del formulario
        $definition = static::adjustFieldForAction($definition, $field, $action);

        $result[$field] = $definition;
    }

    return $result;
}

    // Hook que modelos hijos pueden sobrescribir
    protected static function adjustFieldForAction(array $fieldDef, string $fieldName, ?string $action): array
    {
        return $fieldDef; // Por defecto no hace nada
    }
    protected static function applyFieldMeta(array $definitions, $data = null): array
    {
        foreach ($definitions as $field => &$meta) {
            if ($data !== null) {
                $value = is_array($data) ? ($data[$field] ?? null) : ($data->$field ?? null);
                if (!is_null($value)) $meta['value'] = $value;
            }
        }
        return $definitions;
    }
    public static function getColumns(): array
    {
        return array_map(fn($c) => ['header' => $c[0], 'accessor' => $c[1]], static::$tableColumns ?? []);
    }
    public function parent()
    {
        return $this->parentForeignKey
            ? $this->belongsTo(HistoriaClinica::class, $this->parentForeignKey, 'id')
            : null;
    }
}