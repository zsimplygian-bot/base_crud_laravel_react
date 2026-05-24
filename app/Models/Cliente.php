<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;

class Cliente extends BaseModel {
    use HasFactory;
    protected $table = 'cliente';

    protected static $validationRules = [
        'cliente'   => 'required|string|max:255',
        'dni'       => 'nullable|string|max:8',
        'telefono'  => 'nullable|string|max:9',
        'email'     => 'nullable|email|max:255',
        'direccion' => 'nullable|string|max:255',
    ];

    protected static $tableColumns = [
        ['ID', 'id'],
        ['CLIENTE', 'cliente'],
        ['MASCOTAS', 'total_mascotas'], // Nueva columna visual
        ['TELÉFONO', 'telefono'],
        ['DNI', 'dni'],
        ['DIRECCIÓN', 'direccion'],
        ['FECHA REGISTRO', 'created_at'],
    ];

    public static function getQuery(): array {
        $t1 = 'cliente';
        $t2 = 'mascota';

        $query = DB::table($t1)
            ->leftJoin($t2, "$t1.id_$t1", '=', "$t2.id_$t1") // Unimos con mascotas
            ->select([
                "$t1.id_$t1 as id",
                "$t1.cliente",
                "$t1.dni",
                "$t1.telefono",
                "$t1.direccion",
                "$t1.created_at",
                // Contamos las mascotas asociadas a cada cliente
                DB::raw("COUNT($t2.id_$t2) as total_mascotas"),
            ])
            ->groupBy(
                "$t1.id_$t1", 
                "$t1.cliente", 
                "$t1.dni", 
                "$t1.telefono", 
                "$t1.direccion", 
                "$t1.created_at"
            );

        return ['alias' => $t1, 'query' => $query]; 
    }
}