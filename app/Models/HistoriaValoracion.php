<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class HistoriaValoracion extends BaseModel {
    use HasFactory;
    protected $table = 'historia_valoracion';
    protected static $validationRules = [
        'id_historia' => 'required|integer|exists:historia,id_historia',
        'score' => 'required|string',
        'comentario' => 'nullable|string',
    ];
    protected static $tableColumns = [
        ['ID', 'id_historia_valoracion'],
        ['HISTORIA CLINICA', 'id_historia'],
        ['SCORE', 'score'],
        ['COMENTARIO', 'comentario'],
        ['FECHA REGISTRO', 'created_at'],
    ];
    public static function getQuery(): array {
        $t1 = (new self)->getTable();
        $query = DB::table($t1)->select([
            "$t1.id_$t1",
            "$t1.id_historia",
            "$t1.score",
            "$t1.comentario",
            "$t1.created_at",
        ]);
        return [ 'query' => $query, 'alias' => $t1, ];
    }
    public function parent()
    {
        return $this->belongsTo(Historia::class, 'id_historia');
    }
}