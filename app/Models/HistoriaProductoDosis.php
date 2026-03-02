<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class HistoriaProductoDosis extends BaseModel
{
    use HasFactory;
    protected $table = 'historia_producto_dosis';
    // Reglas alineadas al form
    protected static $validationRules = [
        'id_historia_producto' => 'required|integer|exists:historia_producto,id_historia_producto',
        'id_producto' => 'required|integer|exists:producto,id_producto',
        'cantidad' => 'required|string|max:100',
        'unidad' => 'required|string|max:50',
        'via' => 'nullable|string|max:100',
        'frecuencia' => 'nullable|string|max:100',
        'fecha' => 'required|date_format:Y-m-d H:i:s',
    ];
    // Columnas de tabla / datatable
    protected static $tableColumns = [
        ['ID', 'id_historia_producto_dosis'],
        ['ID PRODUCTO HISTORIA', 'id_historia_producto'],
        ['PRODUCTO', 'nombre_producto'],
        ['CANTIDAD', 'cantidad'],
        ['UNIDAD', 'unidad'],
        ['VIA', 'via'],
        ['FRECUENCIA', 'frecuencia'],
        ['FECHA', 'fecha'],
        ['FECHA REGISTRO', 'created_at'],
    ];
    protected $appends = ['nombre_producto'];
    public static function getQuery(): array
    {
        $t1 = (new self)->getTable(); // historia_producto_dosis
        $t2 = 'producto';
        $query = DB::table($t1)
            ->leftJoin($t2, "$t1.id_producto", '=', "$t2.id_producto")
            ->select([
                "$t1.id_$t1",
                "$t1.id_historia_producto",
                "$t1.id_producto",
                "$t2.producto as nombre_producto",
                "$t1.cantidad",
                "$t1.unidad",
                "$t1.via",
                "$t1.frecuencia",
                "$t1.fecha",
                "$t1.created_at",
            ]);
        return [
            'query' => $query,
            'alias' => $t1,
        ];
    }
    // Relaciones
    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_producto');
    }
    public function HistoriaProducto()
    {
        return $this->belongsTo(
            HistoriaProducto::class,
            'id_historia_producto'
        );
    }
    public function getNombreProductoAttribute()
    {
        return $this->producto->producto ?? null;
    }
}