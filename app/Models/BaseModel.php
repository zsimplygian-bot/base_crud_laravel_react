<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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
    public static function getValidationRules(): array
    {
        return property_exists(static::class, 'validationRules') ? static::$validationRules : [];
    }
    public static function getApiConfig(): array
    {
        return static::$apiConfig ?? [];
    }
    public static function getFormFields($listaController = null, $data = null, string $action = null): array
    {
        return static::buildFields('form', $listaController, $data, $action);
    }
    public static function getToolbarFields($listaController = null): array
    {
        return static::buildFields('toolbar', $listaController);
    }
    public static function getFooterFields(): array
    {
        return static::buildFields('footer');
    }
    public static function getModalFields($listaController = null, $data = null, string $action = null): array
    {
        return static::buildFields('modal', $listaController, $data, $action);
    }
    protected static function buildFields(string $type, $listaController = null, $data = null, string $action = null): array
    {
        $definitions = static::getFieldDefinitions($type, $action, $data);
        return static::buildFieldsFromDefinitions($definitions, $listaController, $data);
    }
    protected static function getFieldDefinitions(string $type, string $action = null, $data = null): array
    {
        $propertyMap = [
            'form'    => 'formFieldDefinitions',
            'toolbar' => 'toolbarFieldDefinitions',
            'footer'  => 'footerFieldDefinitions',
            'modal'   => 'modalFormFieldDefinitions',
        ];
        if (!isset($propertyMap[$type])) return [];
        $property = $propertyMap[$type];
        if (property_exists(static::class, $property) && !empty(static::${$property})) {
            return static::${$property};
        }
        $simpleProperty = 'simple' . ucfirst($property);
        if (property_exists(static::class, $simpleProperty) && !empty(static::${$simpleProperty})) {
            return static::transformSimpleFieldDefinitions(static::${$simpleProperty});
        }
        return [];
    }
    protected static function transformSimpleFieldDefinitions(array $simple): array
    {
        $result = [];
        foreach ($simple as $item) {
            if (!is_array($item) || count($item) < 3) continue;
            [$field, $label, $type] = array_slice($item, 0, 3);
            $width = (isset($item[3]) && is_int($item[3])) ? $item[3] : 2;
            $startOpt = (isset($item[3]) && is_int($item[3])) ? 4 : 3;
            $definition = ['label' => $label, 'type' => $type, 'width' => $width];
            for ($i = $startOpt; $i < count($item); $i++) {
                $opt = $item[$i];
                if (is_string($opt)) {
                    match (true) {
                        in_array($opt, ['readonly', 'disabled', 'required', 'autofocus', 'hidden']) => $definition[$opt] = true,
                        preg_match('/^>(\d+)$/', $opt, $m) => $definition['min'] = (int)$m[1],
                        preg_match('/^<(\d+)$/', $opt, $m) => $definition['max'] = (int)$m[1],
                        preg_match('/^maxlength:(\d+)$/', $opt, $m) => $definition['maxlength'] = (int)$m[1],
                        preg_match('/^pattern:(.+)$/', $opt, $m) => $definition['pattern'] = $m[1],
                        preg_match('/^placeholder:(.+)$/', $opt, $m) => $definition['placeholder'] = trim($m[1]),
                        default => null
                    };
                } elseif (is_array($opt)) {
                    foreach ($opt as $k => $v) {
                        if (!is_null($v)) $definition[$k] = $v;
                    }
                }
            }
            $result[$field] = $definition;
        }
        return $result;
    }
    protected static function buildFieldsFromDefinitions(array $definitions, $listaController = null, $data = null): array
    {
        $fields = [];
        foreach ($definitions as $field => $meta) {
            $form = $meta;
            if ($data !== null) {
                $value = is_array($data) ? ($data[$field] ?? null) : ($data->$field ?? null);
                if (!is_null($value)) $form['value'] = $value;
            }
            if ($listaController && in_array($form['type'] ?? '', ['select', 'multiselect'])) {
                $form['options'] = static::getFieldOptions($field, $listaController);
            }
            $fields[$field] = $form;
        }
        return $fields;
    }
    protected static function getFieldOptions(string $field, $listaController): ?array
{
    // Si no hay lista controller, no hacer nada
    if (!$listaController || !is_object($listaController) || !method_exists($listaController, 'getListaPorCampo')) {
        return null;
    }

    $response = $listaController->getListaPorCampo($field);

    if (is_object($response) && method_exists($response, 'getData')) {
        return $response->getData(true) ?? null;
    }

    return is_array($response) ? $response : null;
}
public static function getTableColumns()
{
    return self::$tableColumns;
}

    public static function getColumns(): array
    {
        if (property_exists(static::class, 'tableColumns') && !empty(static::$tableColumns)) {
            return static::transformSimpleTableColumns(static::$tableColumns);
        }
        if (property_exists(static::class, 'simpleTableColumns') && !empty(static::$simpleTableColumns)) {
            return static::transformSimpleTableColumns(static::$simpleTableColumns);
        }
        return [];
    }
    protected static function transformSimpleTableColumns(array $simple): array
    {
        $result = [];
        foreach ($simple as $item) {
            if (is_array($item) && count($item) === 2) {
                $result[] = ['title' => $item[0], 'column' => $item[1]];
            }
        }
        return $result;
    }
    protected static function autoDetectFields(): array
    {
        $instance = new static();
        $fields = [];
        foreach ($instance->getFillable() as $field) {
            if ($instance->parentForeignKey && $field === $instance->parentForeignKey) continue;
            if ($field === 'creater_id') continue;
            $label = strtoupper(str_replace('_', ' ', $field));
            $type = str_contains($field, 'fecha') ? 'date' : 'text';
            $fields[$field] = ['label' => $label, 'type' => $type, 'width' => 2];
        }
        return $fields;
    }
    public function parent()
    {
        return $this->parentForeignKey
            ? $this->belongsTo(HistoriaClinica::class, $this->parentForeignKey, 'id')
            : null;
    }
}