<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class Mascota extends BaseModel
{
    use HasFactory;
    protected $table = 'mascota'; // tabla
    protected static $validationRules = [
        'mascota'            => 'required|string|max:255',
        'id_cliente'         => 'required|integer',
        'id_raza'            => 'required|integer',
        'id_sexo'            => 'required|integer|max:2',
        'edad'               => 'nullable|integer',
        'color'              => 'nullable|string|max:100',
        'peso'               => 'nullable|numeric',
        'id_estado_mascota'  => 'required|integer',
        'observaciones'      => 'nullable|string',
    ];
    protected static $tableColumns = [
        ['ID', 'id'],
        ['NOMBRE', 'mascota'],
        ['DUEÑO', 'cliente'],
        ['ESPECIE - RAZA', 'raza'],
        ['SEXO', 'sexo'],
        ['ESTADO', 'estado_mascota'],
        ['EDAD', 'edad'],
        ['EDAD ACTUAL', 'edad_actual'],
        ['COLOR', 'color'],
        ['PESO', 'peso'],
        ['IMAGEN', 'archivo'],
        ['FECHA REGISTRO', 'created_at'],
    ];
    public static function getQuery(): array
    {
        $t1 = (new self)->getTable(); // mascota
        $t2 = 'cliente';
        $t3 = 'raza';
        $t4 = 'especie';
        $t5 = 'sexo';
        $t6 = 'estado_mascota';
        return [
            'alias' => $t1,
            'query' => DB::table($t1)
                ->leftJoin($t2, "$t1.id_$t2", '=', "$t2.id_$t2")
                ->leftJoin($t3, "$t1.id_$t3", '=', "$t3.id_$t3")
                ->leftJoin($t4, "$t3.id_$t4", '=', "$t4.id_$t4")
                ->leftJoin($t5, "$t1.id_$t5", '=', "$t5.id_$t5")
                ->leftJoin($t6, "$t1.id_$t6", '=', "$t6.id_$t6")
                ->select([
                    "$t1.id_$t1 as id",
                    "$t1.mascota",
                    "$t2.cliente",
                    DB::raw("CONCAT($t4.especie, ' - ', $t3.raza) as raza"),
                    "$t5.sexo",
                    "$t6.estado_mascota",
                    "$t1.edad",
                    DB::raw("( $t1.edad + TIMESTAMPDIFF(MONTH, $t1.created_at, NOW()) ) as edad_actual"),
                    "$t1.color",
                    "$t1.peso",
                    "$t1.archivo",
                    "$t1.created_at",
                ])
        ];
    }
    public function cliente() { return $this->belongsTo(Cliente::class, 'id_cliente'); } // Relación cliente
    public function raza() { return $this->belongsTo(Raza::class, 'id_raza'); } // Relación raza
    public function sexo() { return $this->belongsTo(Sexo::class, 'id_sexo'); } // Relación sexo
    public function estado() { return $this->belongsTo(EstadoMascota::class, 'id_estado_mascota'); } // Relación estado
}
