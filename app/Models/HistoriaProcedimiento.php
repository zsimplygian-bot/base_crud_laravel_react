<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class HistoriaProcedimiento extends BaseModel {
    use HasFactory;
    protected $table = 'historia_procedimiento';
    protected static $validationRules = [
        'id_historia' => 'required|integer|exists:historia,id_historia',
        'id_procedimiento' => 'required|integer|exists:procedimiento,id_procedimiento',
        'detalle' => 'nullable|string',
        'precio' => 'required|numeric',
        'fecha' => 'required|date_format:Y-m-d H:i:s',
    ];
    protected static $tableColumns = [
        ['ID', 'id_historia_procedimiento'],
        ['HISTORIA CLINICA', 'id_historia'],
        ['ID PROCEDIMIENTO', 'id_procedimiento'],
        ['PROCEDIMIENTO', 'nombre_procedimiento'],
        ['DETALLE', 'detalle'],
        ['PRECIO S/', 'precio'],
        ['FECHA', 'fecha'],
        ['ARCHIVO', 'archivo'],
        ['FECHA REGISTRO', 'created_at'],
    ];
    protected $appends = ['nombre_procedimiento'];
    public static function getQuery(): array {
        $t1 = (new self)->getTable(); // historia_procedimiento
        $t2 = 'procedimiento';
        $query = DB::table("$t1 as $t1")
            ->leftJoin("$t2 as $t2", "$t1.id_$t2", '=', "$t2.id_$t2")
            ->select([
                "$t1.id_$t1",
                "$t1.id_historia",
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
    public function parent() { return $this->belongsTo(Historia::class, $this->parentForeignKey, 'id'); }
}