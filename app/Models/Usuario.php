<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class Usuario extends BaseModel
{
    use HasFactory;
    protected $table = 'users';
    public static string $title = 'Usuarios';
    protected static $simpleFormFieldDefinitions = [
        ['name', 'CLIENTE', 'text', 'required'],
        ['email', 'DNI', 'tel', 'maxlength:8'],
        ['password', 'TELÉFONO', 'tel', 'maxlength:9', 'required'],
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
            "$t1.id",
            "$t1.name",
            "$t1.email",
            "$t1.created_at"
        ]);
        return ['query' => $query, 'alias' => $t1];
    }
    protected static $tableColumns = [
        ['ID', 'id'],
        ['NOMBRE', 'name'],
        ['CORREO', 'email'],
        ['FECHA REGISTRO', 'created_at']
    ];
}