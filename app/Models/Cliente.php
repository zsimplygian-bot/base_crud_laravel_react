<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class Cliente extends BaseModel
{
    use HasFactory;
    protected $table = 'cliente';
    public static string $title = 'Dueños';
    protected static $simpleFormFieldDefinitions = [
        ['cliente', 'CLIENTE',  'text'], 
        ['dni', 'DNI', 'tel', 'maxlength:8'],
        ['telefono', 'TELÉFONO', 'tel', 'maxlength:9'],
        //['email', 'EMAIL', 'email'],
        ['direccion', 'DIRECCIÓN', 'textarea'], 
    ];
    protected static $validationRules = [
        'cliente' => 'required|string|max:255',
        'dni' => 'nullable|string|max:8',
        'telefono' => 'nullable|string|max:9',
        'email' => 'nullable|email|max:255',
        'direccion' => 'nullable|string|max:255',
    ];
    protected static $tableColumns = [
        ['ID', 'id'],
        ['CLIENTE', 'cliente'],
        ['DNI', 'dni'],
        ['TELÉFONO', 'telefono'],
        //['EMAIL', 'email'],
        ['DIRECCIÓN', 'direccion'],
        ['FECHA REGISTRO', 'created_at'],
    ];
    public static function getQuery()
    {
        $alias = (new self)->getTable();
        $query = DB::table($alias)
            ->select([
                "{$alias}.id_{$alias} as id",
                "{$alias}.cliente",
                "{$alias}.dni",
                "{$alias}.telefono",
                //"{$alias}.email",
                "{$alias}.direccion",
                "{$alias}.created_at",
            ]);
        return ['query' => $query, 'alias' => $alias];
    }
}