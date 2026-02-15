<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Relations\HasMany;
class HistoriaClinica extends BaseModel
{
    use HasFactory;
    protected $table = 'historia_clinica';
    public static string $title = 'Historias Clínicas';
    protected static $validationRules = [
        'id_mascota' => 'required|int',
        'fecha' => 'required|date',
        'id_motivo_historia_clinica' => 'required|int',
        'id_motivo' => 'required|int',
        'detalle' => 'nullable|string',
        'observaciones' => 'nullable|string',
        'id_estado_historia_clinica' => 'required|int',
    ];
    protected static $tableColumns = [
        ['ID', 'id'],
        ['MASCOTA', 'mascota'],
        ['DUEÑO', 'cliente'],
        ['FECHA', 'fecha'],
        ['MOTIVO', 'motivo_historia_clinica'],
        ['MOTIVO', 'emoji_motivo'],
        ['DETALLE', 'detalle'],
        ['TOTAL', 'precio'],
        ['OBSERVACIONES', 'observaciones'],
        ['ESTADO', 'estado_historia_clinica'],
        ['FECHA REGISTRO', 'created_at'],
    ];
    public static function getQuery(): array
    {
        $t1 = (new self)->getTable();
        $t2 = 'mascota';
        $t3 = 'cliente';
        $t4 = 'estado_historia_clinica';
        $t5 = 'motivo_historia_clinica';
        $t6 = 'motivo';
        $proc = DB::table('historia_clinica_procedimiento')
            ->select('id_historia_clinica', DB::raw('SUM(precio) as total_procedimientos'))
            ->groupBy('id_historia_clinica'); // Preagregado evita duplicados
        $med = DB::table('historia_clinica_producto')
            ->select('id_historia_clinica', DB::raw('SUM(precio) as total_productos'))
            ->groupBy('id_historia_clinica'); // Preagregado evita duplicados
        $query = DB::table($t1)
            ->leftJoin($t2, "$t1.id_$t2", '=', "$t2.id_$t2")
            ->leftJoin($t3, "$t2.id_$t3", '=', "$t3.id_$t3")
            ->leftJoin($t4, "$t1.id_$t4", '=', "$t4.id_$t4")
            ->leftJoin($t5, "$t1.id_$t5", '=', "$t5.id_$t5")
            ->leftJoin($t6, "$t1.id_$t6", '=', "$t6.id_$t6")
            ->leftJoinSub($proc, 'proc', 'proc.id_historia_clinica', '=', "$t1.id_$t1") // Join limpio
            ->leftJoinSub($med, 'med', 'med.id_historia_clinica', '=', "$t1.id_$t1") // Join limpio
            ->select([
                "$t1.id_$t1 as id",
                "$t2.mascota",
                "$t3.cliente",
                "$t1.fecha",
                "$t5.motivo_historia_clinica as motivo_historia_clinica",
                "$t6.emoji_motivo",
                "$t1.detalle",
                "$t1.observaciones",
                "$t4.estado_historia_clinica",
                "$t1.created_at",
                DB::raw('COALESCE(proc.total_procedimientos,0) + COALESCE(med.total_productos,0) as precio'), // Total real
            ]);
        return ['query' => $query, 'alias' => $t1];
    }
    // App\Models\HistoriaClinica.php
    public static function getRelatedRecords(int $id): array
    {
        return [
            'seguimientos' => HistoriaClinicaSeguimiento::getQuery()['query']
                ->where('id_historia_clinica', $id)
                ->get(),
            'procedimientos' => HistoriaClinicaProcedimiento::getQuery()['query']
                ->where('id_historia_clinica', $id)
                ->get(),
            'productos' => HistoriaClinicaProducto::getQuery()['query']
                ->where('id_historia_clinica', $id)
                ->get(),
            'anamnesis' => HistoriaClinicaAnamnesis::getQuery()['query']
                ->where('id_historia_clinica', $id)
                ->get(),
        ];
    }
    public function historia_seguimientos(): HasMany { return $this->hasMany(HistoriaClinicaSeguimiento::class, 'id_historia_clinica'); }
    public function historia_procedimientos(): HasMany { return $this->hasMany(HistoriaClinicaProcedimiento::class, 'id_historia_clinica'); }
    public function historia_productos(): HasMany { return $this->hasMany(HistoriaClinicaProducto::class, 'id_historia_clinica'); }
    public function historia_anamnesis(): HasMany { return $this->hasMany(HistoriaClinicaAnamnesis::class, 'id_historia_clinica'); }
    public function mascota() { return $this->belongsTo(Mascota::class, 'id_mascota'); }
    public function estado_historia_clinica() { return $this->belongsTo(EstadoHistoriaClinica::class, 'id_estado_historia_clinica'); }
    public function motivo_historia_clinica() { return $this->belongsTo(MotivoHistoriaClinica::class, 'id_motivo_historia_clinica'); }
}