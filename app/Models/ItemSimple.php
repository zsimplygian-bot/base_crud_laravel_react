<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
class ItemSimple extends Model
{
    protected $guarded = [];
    public $timestamps = false;
    protected string $tipo;
    protected $primaryKey = 'id';
    protected $table;
    public static string $title = 'Item Simple';
    protected static array $fieldDefinitions = [];
    public function setTipo(string $tipo): self
    {
        $table = self::resolveTable($tipo);
        if ($table) {
            $this->table = $table;
            $this->primaryKey = 'id_' . $table;
            $this->tipo = $tipo;
            self::$title = self::getTitleForTipo($tipo);
        }
        return $this;
    }
    public function getKeyName()
    {
        return $this->primaryKey;
    }
    public function newModelInstance($attributes = [], $exists = false)
    {
        $model = parent::newModelInstance($attributes, $exists);
        if (isset($this->tipo)) {
            $model->setTipo($this->tipo);
        }
        return $model;
    }
    public function setItemAttribute($value)
    {
        $this->attributes[$this->table] = $value;
    }
    public function getItemAttribute()
    {
        return $this->attributes[$this->table] ?? null;
    }
    public static function forTipo(string $tipo): self
    {
        return (new self())->setTipo($tipo);
    }
    protected static function resolveTable(string $tipo): ?string
    {
        return match ($tipo) {
            'estado_cita', 'estado_mascota', 'motivo_cita', 'especie', 'motivo_historia_clinica' => $tipo,
            default => null,
        };
    }
    public static function getTitleForTipo(string $tipo): string
    {
        return match ($tipo) {
            'motivo_cita' => 'Motivo cita',
            'motivo_historia_clinica' => 'Motivo Historia Clinica',
            default => ucfirst($tipo),
        };
    }
    public static function getFieldDefinitionsForTipo(string $tipo): array
    {
        $title = self::getTitleForTipo($tipo);
        return array_merge(self::$fieldDefinitions, [
            $tipo => [
                'required' => true,
                'type' => 'string',
                'max' => 255,
                'form' => [
                    'label' => mb_strtoupper($title), // 👈 Aquí convertimos a mayúsculas
                    'type' => 'text',
                    'width' => 4,
                ],
            ],
            'tipo' => [
                'required' => true,
                'type' => 'string',
                'form' => [
                    'type' => 'hidden',
                    'value' => $tipo,
                ],
            ],
        ]);
    }
    public static function getValidationRules(string $tipo): array
    {
        return [
            'tipo' => 'required|string|max:255',
            $tipo => 'required|string|max:255',
        ];
    }
    public static function getQuery(?string $search, string $tipo): array
    {
        $model = self::forTipo($tipo);
        $table = $model->getTable();
        $idColumn = 'id_' . $table;
        $textColumn = $table;
        $alias = 't';
        $query = DB::table("{$table} as {$alias}")
            ->select("{$alias}.{$idColumn} as id", "{$alias}.{$textColumn} as item");
        return [
            'query' => $query,
            'alias' => $alias,
        ];
    }
    public static function getTableColumns(string $tipo): array
    {
        return [
            ['title' => 'ID', 'column' => 'id'],
            ['title' => mb_strtoupper(self::getTitleForTipo($tipo)), 'column' => 'item'],
        ];
    }
}