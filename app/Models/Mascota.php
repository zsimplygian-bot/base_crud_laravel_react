<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class Mascota extends BaseModel {
    use HasFactory;
    protected $table = 'mascota'; // Tabla
    protected static $validationRules = [
        'mascota'                     => 'required|string|max:255',
        'id_cliente'                  => 'required|integer',
        'id_raza'                     => 'required|integer',
        'id_sexo'                     => 'required|integer|max:2',
        'fecha_nacimiento'            => 'nullable|date',
        'fecha_nacimiento_estimada'   => 'boolean',
        'color'                       => 'nullable|string|max:100',
        'peso'                        => 'nullable|numeric',
        'activo'                      => 'boolean',
        'observaciones'               => 'nullable|string',
    ];
    protected static $tableColumns = [
        ['ID', 'id'],
        ['NOMBRE', 'mascota'],
        ['DUEÑO', 'cliente'],
        ['ESPECIE', 'emoji_especie'],
        ['RAZA', 'raza'],
        ['SEXO', 'emoji_sexo'],
        ['FECHA NACIMIENTO', 'fecha_nacimiento'],
        ['EDAD', 'edad_meses'],
        ['COLOR', 'color'],
        ['PESO (kg)', 'peso'],
        ['ESTADO', 'activo'],
        ['FECHA REGISTRO', 'created_at'],
    ];
    public static function getQuery(): array {
        $t1 = (new self)->getTable(); // mascota
        $t2 = 'cliente';
        $t3 = 'raza';
        $t4 = 'especie';
        $t5 = 'sexo';
        return [
            'alias' => $t1,
            'query' => DB::table($t1)
                ->leftJoin($t2, "$t1.id_$t2", '=', "$t2.id_$t2")
                ->leftJoin($t3, "$t1.id_$t3", '=', "$t3.id_$t3")
                ->leftJoin($t4, "$t3.id_$t4", '=', "$t4.id_$t4")
                ->leftJoin($t5, "$t1.id_$t5", '=', "$t5.id_$t5")
                ->select([
                    "$t1.id_$t1 as id",
                    "$t1.mascota",
                    "$t2.cliente",
                    "$t4.emoji_especie",
                    "$t3.raza",
                    "$t5.emoji_sexo",
                    "$t1.activo",
                    "$t1.fecha_nacimiento",
                    DB::raw("
                        CASE
                            WHEN $t1.fecha_nacimiento IS NULL THEN NULL
                            ELSE TIMESTAMPDIFF(MONTH, $t1.fecha_nacimiento, CURDATE())
                        END as edad_meses
                    "), // Edad total en meses desde nacimiento hasta hoy
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
}