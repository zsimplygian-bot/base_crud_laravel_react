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
        ['FECHA REGISTRO', 'created_at'],
    ];
    protected $appends = ['nombre_procedimiento'];
    public static function getQuery()
    {
        $al1 = (new self)->getTable();
        $query = DB::table($al1)
            ->leftJoin('procedimiento', 'procedimiento.id_procedimiento', '=', "{$al1}.id_procedimiento")
            ->select([
                "{$al1}.id_historia_clinica_procedimiento", 
                "{$al1}.id_historia_clinica", 
                "procedimiento.procedimiento as nombre_procedimiento",
                "{$al1}.id_procedimiento",
                "{$al1}.detalle",
                "{$al1}.precio",
                "{$al1}.fecha",
                "{$al1}.created_at",
            ]);
        return ['query' => $query, 'alias' => $al1];
    }
    public function procedimiento()
    {
        return $this->belongsTo(Procedimiento::class, 'id_procedimiento');
    }
    public function getNombreProcedimientoAttribute()
    {
        return $this->procedimiento->procedimiento ?? null;
    }
    public function parent()
    {
        return $this->belongsTo(HistoriaClinica::class, $this->parentForeignKey, 'id');
    }
}