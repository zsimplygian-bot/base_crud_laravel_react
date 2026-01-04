<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
abstract class BaseModel extends Model
{
    use HasFactory;
    protected $primaryKey; // PK
    public $incrementing = true; // auto
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->primaryKey = 'id_' . $this->getTable(); // id_tabla
        if (property_exists(static::class, 'validationRules')) {
            $this->fillable = array_keys(static::$validationRules); // fillable
        }
    }
    protected static function table(): string
    {
        return (new static)->getTable(); // tabla
    }
    protected static function fields(): array
    {
        return [static::table() . '.*']; // default
    }
    public static function getQuery(): array
    {
        $t = static::table(); // tabla
        return [ 'alias' => $t, // alias
                'query' => DB::table($t)->select(static::fields()), // builder
        ];
    }
    public static function showById($id)
    {
        $q = static::getQuery(); // query
        return $q['query']->where("{$q['alias']}.id_{$q['alias']}", $id)->first(); // show
    }
    public static function getValidationRules(): array
    {
        return static::$validationRules ?? []; // rules
    }
    public static function getColumns(): array
    {
        return array_map(fn ($c) => ['header' => $c[0], 'accessor' => $c[1]], static::$tableColumns ?? []); // cols
    }
}
