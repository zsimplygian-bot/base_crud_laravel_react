<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class HistoriaAnamnesis extends BaseModel {
    use HasFactory;
    protected $table = 'historia_anamnesis';
    protected static $validationRules = [
        'id_historia' => 'required|integer|exists:historia,id_historia',
        'fecha' => 'required|datetime',
        'temperatura' => 'nullable|numeric',
        'frecuencia_cardiaca' => 'nullable|numeric',
        'frecuencia_respiratoria' => 'nullable|numeric',
        'tiempo_llenado_capilar' => 'nullable|numeric',
        'peso' => 'nullable|numeric',
    ];
    public static function getQuery(): array {
        $t1 = (new self)->getTable();
        $query = DB::table($t1)->select([
                "$t1.id_$t1",
                "$t1.id_historia",
                "$t1.fecha",
                "$t1.temperatura",
                "$t1.frecuencia_cardiaca",
                "$t1.frecuencia_respiratoria",
                "$t1.tiempo_llenado_capilar",
                "$t1.peso",
                "$t1.archivo",
                "$t1.created_at",
            ]);
        return ['query' => $query, 'alias' => $t1];
    }
    protected static $tableColumns = [
        ['ID', 'id_historia_anamnesis'],
        ['HISTORIA CLINICA', 'id_historia'],
        ['FECHA', 'fecha'],
        ['HORA', 'hora'],
        ['TEMPERATURA (°C)', 'temperatura'],
        ['FRECUENCIA CARDIACA (lpm)', 'frecuencia_cardiaca'],
        ['FRECUENCIA RESPIRATORIA (rpm)', 'frecuencia_respiratoria'],
        ['TIEMPO LLENADO CAPILAR (seg)', 'tiempo_llenado_capilar'],
        ['PESO (kg)', 'peso'],
        ['ARCHIVO', 'archivo'],
        ['FECHA REGISTRO', 'created_at'],
    ];
    public function parent() { return $this->belongsTo(Historia::class, $this->parentForeignKey, 'id'); }
}