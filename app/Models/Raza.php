<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class Raza extends BaseModel
{
    use HasFactory;
    protected $table = 'raza';
    protected static $validationRules = [
        'id_especie' => 'required|int',
        'raza' => 'required|string|max:100',
    ];
    protected static $tableColumns = [
        ['ID','id'],
        ['RAZA','raza'],
        ['FECHA REGISTRO','created_at'],
    ];
    public static function getQuery(): array
    {
        $t1 = (new self)->getTable(); // Tabla raza
        $t2 = 'especie'; // Tabla especie
        return [
            'alias' => $t1,
            'query' => DB::table($t1)
                ->leftJoin($t2, "$t1.id_$t2", '=', "$t2.id_$t2")
                ->select([
                    "$t1.id_$t1 as id",
                    DB::raw("CONCAT($t2.especie,' - ',$t1.raza) as raza"),
                    "$t1.created_at",
                ]),
        ];
    }
    public function especie() { return $this->belongsTo(Especie::class,'id_especie'); } // Relacion especie
}
