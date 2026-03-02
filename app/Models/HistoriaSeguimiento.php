<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class HistoriaSeguimiento extends BaseModel {
    use HasFactory;
    protected $table = 'historia_seguimiento';
    protected static $validationRules = [
        'id_historia' => 'required|integer|exists:historia,id_historia',
        'detalle' => 'required|string',
        'observaciones' => 'nullable|string',
        'fecha' => 'required|date_format:Y-m-d H:i:s',
    ];
    protected static $tableColumns = [
        ['ID', 'id_historia_seguimiento'],
        ['HISTORIA CLINICA', 'id_historia'],
        ['DETALLE', 'detalle'],
        ['OBSERVACIONES', 'observaciones'],
        ['FECHA', 'fecha'],
        ['ARCHIVO', 'archivo'],
        ['FECHA REGISTRO', 'created_at'],
    ];
    public static function getQuery(): array {
        $t1 = (new self)->getTable();
        $query = DB::table($t1)->select([
            "$t1.id_$t1",
            "$t1.id_historia",
            "$t1.detalle",
            "$t1.observaciones",
            "$t1.fecha",
            "$t1.archivo",
            "$t1.created_at",
        ]);
        return [ 'query' => $query, 'alias' => $t1, ];
    }
    public function parent()
    {
        return $this->belongsTo(Historia::class, 'id_historia');
    }
}