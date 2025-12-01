<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class Mascota extends BaseModel
{
    use HasFactory;
    protected $table = 'mascota';
    public static string $title = 'Mascotas';
    protected static $simpleFormFieldDefinitions = [
        ['mascota', 'MASCOTA', 'text', 'required'],
        ['id_cliente', 'DUEÑO', 'select', 'required'],
        ['id_raza', 'ESPECIE - RAZA', 'select', 'required'],
        ['id_sexo', 'SEXO', 'select', 1, 'required'],
        ['edad', 'EDAD MESES', 'number', 1, 'required'],
        ['edad_extendida', 'EDAD', 'text', 1.5, 'disabled'],
        ['color', 'COLOR', 'text', 'required'],
        ['peso', 'PESO (KG)', 'number', 1, 'required'],
        ['id_estado_mascota', 'ESTADO', 'select', 'required'],
        ['observaciones', 'OBSERVACIONES', 'textarea'],
        ['archivo', 'ARCHIVO', 'file'],
    ];
    protected static function adjustFieldForAction(array $fieldDef, string $fieldName, ?string $action): array
    {
        if ($action === 'create') {
            if ($fieldName === 'id_estado_mascota') {
                $fieldDef['type'] = 'hidden';
                $fieldDef['value'] = 1;
            }
        }
        return $fieldDef;
    }
    protected static $validationRules = [
        'mascota' => 'required|string|max:255',
        'id_cliente' => 'required|int',
        'id_raza' => 'required|int',
        'id_sexo' => 'required|int|max:2',
        'edad' => 'nullable|int',
        'color' => 'nullable|string|max:100',
        'peso' => 'nullable|numeric',
        'id_estado_mascota' => 'required|int',
        'observaciones' => 'nullable|string',
    ];
    protected static $simpleToolbarFieldDefinitions = [
        ['id_cliente', 'DUEÑO', 'select'],
        ['id_raza', 'RAZA', 'select'],
        ['id_sexo', 'SEXO', 'select', 1],
        ['id_estado_mascota', 'ESTADO', 'select'],
    ];
    public static array $allowedFilters = ['id_cliente', 'id_raza', 'id_sexo', 'id_estado_mascota']; // NUEVO
    public static function getQuery() {
        $t1 = (new self)->getTable();
        $t2 = 'cliente';
        $t3 = 'raza';
        $t4 = 'especie';
        $t5 = 'sexo';
        $t6 = 'estado_mascota';
        $query = DB::table($t1)
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
            "$t3.raza as raza_original",
            "$t5.sexo",
            "$t1.edad",
            DB::raw("( $t1.edad + TIMESTAMPDIFF(MONTH, $t1.created_at, NOW()) ) as edad_actual"),
            "$t1.color",
            "$t1.peso",
            "$t6.estado_mascota",
            "$t1.archivo",
            "$t1.created_at",
        ]);
        return ['query' => $query, 'alias' => $t1];
    }
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
    public function cliente() { return $this->belongsTo(Cliente::class, 'id_cliente'); }
    public function raza() { return $this->belongsTo(Raza::class, 'id_raza'); }
    public function sexo() { return $this->belongsTo(Sexo::class, 'id_sexo'); }
    public function estado() { return $this->belongsTo(EstadoMascota::class, 'id_estado_mascota'); }
}