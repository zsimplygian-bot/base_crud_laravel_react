<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
abstract class BaseModel extends Model
{
    use HasFactory; // Permite usar factories de Laravel
    protected $primaryKey; // Nombre de la llave primaria
    public $incrementing = true; // Indica que la llave primaria se auto-incrementa
    public function __construct(array $attributes = []) // Constructor del modelo
    {
        parent::__construct($attributes); // Llama al constructor del Model base
        $this->primaryKey = 'id_' . $this->getTable(); // Asigna la PK dinámica según el nombre de la tabla
        if (property_exists(static::class, 'validationRules')) { // Si hay reglas de validación definidas
            $this->fillable = array_keys(static::$validationRules); // Llenables son las claves de las reglas
        }
    }
    protected static function assignFormField(array $formFields, string $field, mixed $value): array // Asigna valor a un campo del formulario
    {
        if (isset($formFields[$field])) { // Si el campo existe
            $formFields[$field]['value'] = $value; // Asigna el valor
        }
        return $formFields; // Devuelve los campos actualizados
    }
    public static function getValidationRules(): array // Retorna las reglas de validación del modelo
    {
        return property_exists(static::class, 'validationRules') ? static::$validationRules : []; // Devuelve reglas si existen
    }
    public static function getApiConfig(): array // Retorna configuración de API si existe
    {
        return static::$apiConfig ?? []; // Devuelve configuración o array vacío
    }
    public static function getFormFields($listaController = null, $data = null, string $action = 'create'): array // Devuelve campos para formularios
    {
        $definitions = static::getFieldDefinitions('form', $action, $data); // Obtiene definiciones de campos
        return static::buildFieldsFromDefinitions($definitions, $listaController, $data); // Construye campos finales con valores y opciones
    }
    public static function getToolbarFields($listaController = null): array // Campos de toolbar
    {
        $definitions = static::getFieldDefinitions('toolbar'); // Obtiene definiciones
        return static::buildFieldsFromDefinitions($definitions, $listaController); // Construye campos
    }
    public static function getFooterFields(): array // Campos de footer
    {
        $definitions = static::getFieldDefinitions('footer'); // Obtiene definiciones
        return static::buildFieldsFromDefinitions($definitions); // Construye campos
    }
    public static function getSheetFields($listaController = null): array // Campos tipo hoja (sheet)
    {
        $definitions = static::getFieldDefinitions('sheet'); // Obtiene definiciones
        return static::buildFieldsFromDefinitions($definitions, $listaController); // Construye campos
    }
    protected static function getFieldDefinitions(string $type, string $action = 'create', $data = null): array // Obtiene definiciones según tipo de campo
    {
        $propertyMap = [ // Mapeo de tipo a propiedad
            'form'    => 'formFieldDefinitions',
            'toolbar' => 'toolbarfieldDefinitions',
            'footer'  => 'footerfieldDefinitions',
            'sheet'   => 'sheetfieldDefinitions',
        ];
        if (isset($propertyMap[$type])) { // Si existe tipo
            $property = $propertyMap[$type]; // Nombre de la propiedad
            if (property_exists(static::class, $property) && !empty(static::${$property})) { // Si la propiedad existe y tiene contenido
                return static::${$property}; // Devuelve la propiedad
            }
            $simpleProperty = 'simple' . ucfirst($property); // Nombre de la versión simple
            if (property_exists(static::class, $simpleProperty) && !empty(static::${$simpleProperty})) { // Si existe versión simple
                return static::transformSimpleFieldDefinitions(static::${$simpleProperty}); // La transforma a formato completo
            }
        }
        return []; // Devuelve array vacío si no hay definiciones
    }
    protected static function transformSimpleFieldDefinitions(array $simple): array
    {
        $result = [];
        foreach ($simple as $item) {
            if (!is_array($item) || count($item) < 3) continue;

            $field = $item[0];
            $label = $item[1];
            $type  = $item[2];
            // Determinar width y desde dónde empiezan las opciones
            $width = 2; // default
            if (isset($item[3]) && is_int($item[3])) {
                $width = $item[3];
                $startOpt = 4;
            } else {
                $startOpt = 3;
            }
            $definition = [
                'label' => $label,
                'type'  => $type,
                'width' => $width,
            ];
            // Analiza los argumentos extra
            for ($i = $startOpt; $i < count($item); $i++) {
    $opt = $item[$i];
    if (is_string($opt)) {
        if (in_array($opt, ['readonly', 'disabled', 'required', 'autofocus'])) {
            $definition[$opt] = true;
        } elseif (preg_match('/^>(\d+)$/', $opt, $match)) {
            $definition['min'] = (int)$match[1];
        } elseif (preg_match('/^<(\d+)$/', $opt, $match)) {
            $definition['max'] = (int)$match[1];
        } elseif (preg_match('/^maxlength:(\d+)$/', $opt, $match)) {
            $definition['maxlength'] = (int)$match[1];
        } elseif (preg_match('/^pattern:(.+)$/', $opt, $match)) {
            $definition['pattern'] = $match[1];
        } elseif (preg_match('/^placeholder:(.+)$/', $opt, $match)) {
            $definition['placeholder'] = trim($match[1]);
        }
    } elseif (is_array($opt)) {
        foreach ($opt as $key => $val) {
            if (!is_null($val)) {
                $definition[$key] = $val;
            }
        }
    }
}

            $result[$field] = $definition;
        }
        return $result;
    }
    protected static function buildFieldsFromDefinitions(array $definitions, $listaController = null, $data = null): array // Construye campos finales
    {
        $fields = []; // Resultado
        foreach ($definitions as $field => $meta) { // Recorre cada definición
            $form = $meta; // Copia definición
            if ($data !== null) { // Si hay datos
                $value = is_array($data) ? ($data[$field] ?? null) : ($data->$field ?? null); // Obtiene valor
                if (!is_null($value)) { // Si existe
                    $form['value'] = $value; // Asigna
                }
            }
            if ($listaController && in_array($form['type'] ?? '', ['select', 'multiselect'])) { // Si es select
                $form['options'] = static::getFieldOptions($field, $listaController); // Obtiene opciones
            }
            $fields[$field] = $form; // Asigna campo final
        }
        return $fields; // Devuelve todos los campos
    }
    protected static function getFieldOptions(string $field, $listaController): ?array // Obtiene opciones para selects
    {
        $response = $listaController->getListaPorCampo($field); // Llama al controlador
        if (method_exists($response, 'getData')) { // Si tiene getData
            return $response->getData(true) ?? null; // Devuelve array de datos
        }
        return is_array($response) ? $response : null; // Si ya es array, devuelve
    }
    public static function getColumns(): array // Columnas de tabla
    {
        if (property_exists(static::class, 'tableColumns') && !empty(static::$tableColumns)) { // Si existe definición
            return static::transformSimpleTableColumns(static::$tableColumns); // Transforma
        }
        if (property_exists(static::class, 'simpleTableColumns') && !empty(static::$simpleTableColumns)) { // Alternativa simple
            return static::transformSimpleTableColumns(static::$simpleTableColumns); // Transforma
        }
        return []; // Si no hay nada, devuelve vacío
    }
    protected static function transformSimpleTableColumns(array $simple): array // Transforma columnas simples a completas
    {
        $result = []; // Resultado
        foreach ($simple as $item) { // Recorre
            if (is_array($item) && count($item) === 2) { // Valida formato [titulo, columna]
                $result[] = ['title' => $item[0], 'column' => $item[1]]; // Asigna al resultado
            }
        }
        return $result; // Devuelve columnas transformadas
    }
}