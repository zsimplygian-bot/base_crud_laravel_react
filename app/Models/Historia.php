<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Historia extends BaseModel {
    use HasFactory;
    protected $table = 'historia';
    protected static $validationRules = [
        'id_mascota' => 'required|int',
        'fecha' => 'required|datetime',
        'id_motivo' => 'required|int',
        'detalle' => 'nullable|string',
        'observaciones' => 'nullable|string',
        'id_estado_historia' => 'required|int',
    ];
    protected static $tableColumns = [
        ['ID', 'id'],
        ['MASCOTA', 'mascota'],
        ['DUEÑO', 'cliente'],
        ['FECHA', 'fecha'],
        ['MOTIVO', 'motivo'],
        ['MOTIVO', 'emoji_motivo'],
        ['DETALLE', 'detalle'],
        ['TOTAL (S/.)', 'precio'],
        ['OBSERVACIONES', 'observaciones'],
        ['ESTADO', 'estado_historia'],
        ['FECHA REGISTRO', 'created_at'],
    ];
    public static function getQuery(): array {
        $t1 = (new self)->getTable();
        $t2 = 'mascota';
        $t3 = 'cliente';
        $t4 = 'estado_historia';
        $t5 = 'motivo';
        $proc = DB::table('historia_procedimiento')
            ->select('id_historia', DB::raw('SUM(precio) as total_procedimientos'))
            ->groupBy('id_historia'); // Preagregado evita duplicados
        $med = DB::table('historia_producto')
            ->select('id_historia', DB::raw('SUM(precio) as total_productos'))
            ->groupBy('id_historia'); // Preagregado evita duplicados
        $query = DB::table($t1)
            ->leftJoin($t2, "$t1.id_$t2", '=', "$t2.id_$t2")
            ->leftJoin($t3, "$t2.id_$t3", '=', "$t3.id_$t3")
            ->leftJoin($t4, "$t1.id_$t4", '=', "$t4.id_$t4")
            ->leftJoin($t5, "$t1.id_$t5", '=', "$t5.id_$t5")
            ->leftJoinSub($proc, 'proc', 'proc.id_historia', '=', "$t1.id_$t1")
            ->leftJoinSub($med, 'med', 'med.id_historia', '=', "$t1.id_$t1")
            ->select([
                "$t1.id_$t1 as id",
                "$t2.mascota",
                "$t3.cliente",
                "$t1.fecha",
                "$t5.motivo",
                "$t5.emoji_motivo",
                "$t1.detalle",
                "$t1.observaciones",
                "$t4.estado_historia",
                "$t1.created_at",
                DB::raw('COALESCE(proc.total_procedimientos,0) + COALESCE(med.total_productos,0) as precio'),
            ]);
        return ['query' => $query, 'alias' => $t1];
    }
    public static function getAllRelatedRecords(int $id): array {
        $historia = self::findOrFail($id);
        // Traer todos los related records y agregar campo _view
        $seguimientos = $historia->historia_seguimientos()->get()->map(fn($r) => ['_view'=>'historia_seguimiento', ...$r->toArray()])->toArray();
        $procedimientos = $historia->historia_procedimientos()->get()->map(fn($r) => ['_view'=>'historia_procedimiento', ...$r->toArray()])->toArray();
        $productos = $historia->historia_productos()->get()->map(fn($r) => ['_view'=>'historia_producto', ...$r->toArray()])->toArray();
        $anamnesis = $historia->historia_anamnesis()->get()->map(fn($r) => ['_view'=>'historia_anamnesis', ...$r->toArray()])->toArray();
        // Combinar y ordenar por fecha
        $combined = array_merge($seguimientos, $procedimientos, $productos, $anamnesis);
        usort($combined, function ($a, $b) {
            $dateA = strtotime($a['fecha'] ?? $a['created_at'] ?? 0);
            $dateB = strtotime($b['fecha'] ?? $b['created_at'] ?? 0);
            return $dateA <=> $dateB;
        });
        return $combined;
    }
    public function historia_seguimientos(): HasMany { return $this->hasMany(HistoriaSeguimiento::class, 'id_historia'); }
    public function historia_procedimientos(): HasMany { return $this->hasMany(HistoriaProcedimiento::class, 'id_historia'); }
    public function historia_productos(): HasMany { return $this->hasMany(HistoriaProducto::class, 'id_historia'); }
    public function historia_anamnesis(): HasMany { return $this->hasMany(HistoriaAnamnesis::class, 'id_historia'); }
    public function mascota() { return $this->belongsTo(Mascota::class, 'id_mascota'); }
    public function estado_historia() { return $this->belongsTo(EstadoHistoria::class, 'id_estado_historia'); }
    public function motivo() { return $this->belongsTo(Motivo::class, 'id_motivo'); }
}