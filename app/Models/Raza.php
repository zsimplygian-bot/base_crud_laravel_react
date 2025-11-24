<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class Raza extends BaseModel
{
    use HasFactory;
    protected $table = 'raza';
    public static string $title = 'Razas';
    protected static $simpleFormFieldDefinitions = [
        ['id_especie', 'ESPECIE',  'select'], 
        ['raza', 'RAZA', 'text'],
    ];
    protected static $validationRules = [
        'id_especie' => 'required|int|max:255',
        'raza' => 'required|string|max:100',
    ];
    public static function getQuery() {
        $t1 = (new self)->getTable(); // raza
        $t2 = 'especie';
        $query = DB::table($t1)
            ->leftJoin($t2, "$t1.id_$t2", '=', "$t2.id_$t2")
            ->select([
                "$t1.id_$t1 as id",
                "$t2.especie",
                DB::raw("CONCAT($t2.especie, ' - ', $t1.raza) as raza"),
            ]);
        return ['query' => $query, 'alias' => $t1];
    }
    protected static $tableColumns = [
        ['ID', 'id'],
        ['RAZA', 'raza'],
    ];
    public function especie() { return $this->belongsTo(Especie::class, 'id_especie'); }
}