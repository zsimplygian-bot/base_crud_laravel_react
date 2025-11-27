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
        ['cliente', 'CLIENTE', 'text', 'required'],
        ['dni', 'DNI', 'tel', 'maxlength:8'],
        ['telefono', 'TELÉFONO', 'tel', 'maxlength:9', 'required'],
        ['direccion', 'DIRECCIÓN', 'textarea', 'placeholder:Ejemplo: Virgen del Carmen MZ #',]
    ];
    protected static $validationRules = [
        'cliente' => 'required|string|max:255',
        'dni' => 'nullable|string|max:8',
        'telefono' => 'nullable|string|max:9',
        'email' => 'nullable|email|max:255',
        'direccion' => 'nullable|string|max:255'
    ];
    public static function getQuery()
    {
        $t1 = (new self)->getTable();
        $query = DB::table($t1)->select([
            "$t1.id_$t1 as id",
            "$t1.cliente",
            "$t1.dni",
            "$t1.telefono",
            "$t1.direccion",
            "$t1.created_at"
        ]);
        return ['query' => $query, 'alias' => $t1];
    }
    protected static $tableColumns = [
        ['ID', 'id'],
        ['CLIENTE', 'cliente'],
        ['DNI', 'dni'],
        ['TELÉFONO', 'telefono'],
        ['DIRECCIÓN', 'direccion'],
        ['FECHA REGISTRO', 'created_at']
    ];
}