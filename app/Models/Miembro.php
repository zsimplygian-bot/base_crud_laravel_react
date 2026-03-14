<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class Miembro extends BaseModel {
    use HasFactory;
    protected $table = 'miembro'; // Tabla
    protected static $validationRules = [
        'id_coordinador' => 'required|integer',
        'dni'            => 'required|string|max:8',
        'ape_nom'      => 'required|string|max:100',
        'telefono'       => 'nullable|string|max:20',
        'mesa_numero'    => 'required|string|max:11',
        'fecha_encuentro'=> 'nullable|date',
        'id_rol_miembro' => 'required|integer',
        'id_estado_miembro' => 'required|int',
        'ubicacion'         => 'nullable|string',
        'observaciones'  => 'nullable|string',
    ];
    protected static $tableColumns = [
        ['ID','id'],
        ['DNI','dni'],
        ['MIEMBRO','ape_nom'],
        ['CTM','coordinador'],
        ['MESA','mesa_numero'],
        ['ROL','rol_miembro'],
        ['ESTADO','estado_miembro'],
        ['TELÉFONO','telefono'],
        ['OBSERVACIONES','observaciones'],
        ['SITIO','ubicacion'],
        ['FECHA ENCUENTRO','fecha_encuentro'],
        ['FECHA REGISTRO','created_at'],
    ];
    public static function getQuery(): array {
        $t1 = (new self)->getTable(); // miembro
        $t2 = 'coordinador';
        $t3 = 'rol_miembro';
        $t4 = 'estado_miembro';    
        return [
            'alias' => $t1,
            'query' => DB::table($t1)
                ->leftJoin($t2, "$t1.id_$t2",'=',"$t2.id_$t2")
                ->leftJoin($t3, "$t1.id_$t3",'=',"$t3.id_$t3")
                ->leftJoin($t4, "$t1.id_$t4",'=',"$t4.id_$t4")
                ->select([
                    "$t1.id_$t1 as id",
                    "$t1.dni",
                    "$t1.ape_nom",
                    "$t2.coordinador",
                    "$t1.mesa_numero",
                    "$t3.rol_miembro",
                    "$t4.estado_miembro",
                    "$t1.telefono",
                    "$t1.observaciones",
                    "$t1.ubicacion",
                    "$t1.fecha_encuentro",
                    "$t1.created_at",
                ])
        ];
    }
    public function coordinador(){ return $this->belongsTo(Coordinador::class,'id_coordinador'); } // Relación coordinador
    public function rol_miembro(){ return $this->belongsTo(RolMiembro::class,'id_rol_miembro'); } // Relación rol
    public function estado_miembro(){ return $this->belongsTo(EstadoMiembro::class,'id_estado_miembro'); } // Relación rol
}