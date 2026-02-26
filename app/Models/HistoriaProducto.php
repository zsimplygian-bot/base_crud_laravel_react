<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HistoriaProducto extends BaseModel
{
    use HasFactory;

    protected $table = 'historia_producto';

    protected static $validationRules = [
        'id_historia' => 'required|integer|exists:historia,id_historia',
        'dosis' => 'required|string|max:50',
        'precio' => 'nullable|numeric',
        'fecha' => 'required|date',
    ];

    protected static $tableColumns = [
        ['ID', 'id_historia_producto'],
        ['HISTORIA CLINICA', 'id_historia'],
        ['ID PRODUCTO', 'id_producto'],
        ['PRODUCTO', 'nombre_producto'],
        ['CANTIDAD', 'cantidad'],
        ['UNIDAD', 'unidad'],
        ['VÍA', 'via'],
        ['FRECUENCIA', 'frecuencia'],
        ['FECHA', 'fecha'],
        ['FECHA REGISTRO', 'created_at'],
    ];

    protected $appends = [
        'productos', // Append nuevo
    ];

    public static function getQuery(): array
    {
        $t1 = (new self)->getTable();
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

        return ['query' => $query, 'alias' => $t1];
    }

    // Relaciones
    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_producto');
    }

    public function historia_productos_dosis(): HasMany
    {
        return $this->hasMany(HistoriaProductoDosis::class, 'id_historia_producto');
    }

    // Appends
    public function getNombreProductoAttribute()
    {
        return $this->producto->producto ?? null;
    }

    public function getProductosAttribute()
    {
        return $this->historia_productos_dosis()
            ->get()
            ->map(fn($r) => [
                'id' => $r->id_historia_producto_dosis,
                'producto' => $r->nombre_producto,
                'cantidad' => $r->cantidad,
                'unidad' => $r->unidad,
                'via' => $r->via,
                'frecuencia' => $r->frecuencia,
                'fecha' => $r->fecha,
            ])
            ->values()
            ->toArray(); // Siempre retorna array limpio
    }
    public static function getAllRelatedRecords(int $id): array
    {
        $historia = self::findOrFail($id);
        // Traer todos los related records y agregar campo _view
        $productos = $historia->historia_productos_dosis()->get()->map(fn($r) => ['_view'=>'historia_producto_dosis', ...$r->toArray()])->toArray();
        // Combinar y ordenar por fecha
        $combined = array_merge($productos);
        usort($combined, function ($a, $b) {
            $dateA = strtotime($a['fecha'] ?? $a['created_at'] ?? 0);
            $dateB = strtotime($b['fecha'] ?? $b['created_at'] ?? 0);
            return $dateA <=> $dateB;
        });
        return $combined;
    }
    public function parent()
    {
        return $this->belongsTo(Historia::class, $this->parentForeignKey, 'id');
    }
}