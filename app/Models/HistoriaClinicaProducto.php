<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class HistoriaClinicaProducto extends BaseModel {
    use HasFactory;
    protected $table = 'historia_clinica_producto';
    protected static $validationRules = [
        'id_historia_clinica' => 'required|integer|exists:historia_clinica,id_historia_clinica',
        'id_producto' => 'required|integer|exists:producto,id_producto',
        'dosis' => 'required|string|max:255',
        'precio' => 'required|numeric',
        'fecha' => 'required|datetime',
    ];
    protected static $tableColumns = [
        ['ID', 'id_historia_clinica_producto'],
        ['HISTORIA CLINICA', 'id_historia_clinica'],
        ['ID PRODUCTO', 'id_producto'],
        ['PRODUCTO', 'nombre_producto'],
        ['DOSIS', 'dosis'],
        ['PRECIO S/', 'precio'],
        ['FECHA', 'fecha'],
        ['ARCHIVO', 'archivo'],
        ['FECHA REGISTRO', 'created_at'],
    ];
    protected $appends = ['nombre_producto'];
    public static function getQuery(): array {
        $t1 = (new self)->getTable(); // historia_clinica_producto
        $t2 = 'producto';
        $query = DB::table("$t1")
            ->leftJoin("$t2", "$t1.id_$t2", '=', "$t2.id_$t2")
            ->select([
                "$t1.id_$t1",
                "$t1.id_historia_clinica",
                "$t2.producto as nombre_producto",
                "$t1.id_producto",
                "$t1.dosis",
                "$t1.precio",
                "$t1.fecha",
                "$t1.archivo",
                "$t1.created_at",
            ]);
        return ['query' => $query, 'alias' => $t1];
    }
    public function producto() { return $this->belongsTo(Producto::class, 'id_producto'); }
    public function getNombreproductoAttribute() { return $this->producto->producto ?? null; }
    public function parent() { return $this->belongsTo(HistoriaClinica::class, $this->parentForeignKey, 'id'); }
}