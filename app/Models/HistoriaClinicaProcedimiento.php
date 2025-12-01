<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class HistoriaClinicaProcedimiento extends BaseModel
{
    use HasFactory;
    protected $table = 'historia_clinica_procedimiento';
    public static string $title = 'Procedimiento';
    protected static $simpleModalFormFieldDefinitions = [
        ['id_historia_clinica', 'HISTORIA', 'text', 'required'],
        ['id_procedimiento', 'PROCEDIMIENTO', 'select', 'required'],
        ['detalle', 'DETALLE', 'textarea'],
        ['precio', 'PRECIO S/', 'number', 'required'],
        ['fecha', 'FECHA', 'date', 'required'],
        ['archivo', 'ARCHIVO', 'file'],
    ];
    protected static $validationRules = [
        'id_historia_clinica' => 'required|integer|exists:historia_clinica,id_historia_clinica',
        'id_procedimiento' => 'required|integer|exists:procedimiento,id_procedimiento',
        'detalle' => 'nullable|string',
        'precio' => 'required|numeric',
        'fecha' => 'required|date',
    ];
    protected static $tableColumns = [
        ['ID', 'id_historia_clinica_procedimiento'],
        ['HISTORIA CLINICA', 'id_historia_clinica'],
        ['ID PROCEDIMIENTO', 'id_procedimiento'],
        ['PROCEDIMIENTO', 'nombre_procedimiento'],
        ['DETALLE', 'detalle'],
        ['PRECIO S/', 'precio'],
        ['FECHA', 'fecha'],
        ['ARCHIVO', 'archivo'],
        ['FECHA REGISTRO', 'created_at'],
    ];
    protected $appends = ['nombre_procedimiento'];
    public static function getQuery() {
        $t1 = (new self)->getTable(); // historia_clinica_procedimiento
        $t2 = 'procedimiento';
        $query = DB::table("$t1 as $t1")
            ->leftJoin("$t2 as $t2", "$t1.id_$t2", '=', "$t2.id_$t2")
            ->select([
                "$t1.id_$t1",
                "$t1.id_historia_clinica",
                "$t2.procedimiento as nombre_procedimiento",
                "$t1.id_procedimiento",
                "$t1.detalle",
                "$t1.precio",
                "$t1.fecha",
                "$t1.archivo",
                "$t1.created_at",
            ]);
        return ['query' => $query, 'alias' => $t1];
    }
    public function procedimiento() { return $this->belongsTo(Procedimiento::class, 'id_procedimiento'); }
    public function getNombreProcedimientoAttribute() { return $this->procedimiento->procedimiento ?? null; }
    public function parent() { return $this->belongsTo(HistoriaClinica::class, $this->parentForeignKey, 'id'); }
}