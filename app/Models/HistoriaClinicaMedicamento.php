<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class HistoriaClinicaMedicamento extends BaseModel
{
    use HasFactory;
    protected $table = 'historia_clinica_medicamento';
    public static string $title = 'Medicamento';
    protected static $simpleModalFormFieldDefinitions = [
        ['id_historia_clinica', 'HISTORIA', 'text', 'required'],
        ['id_medicamento', 'MEDICAMENTO', 'select', 'required'],
        ['dosis', 'DOSIS', 'text', 'required'],
        ['precio', 'PRECIO S/', 'number', 'required'],
        ['fecha', 'FECHA', 'date', 'required'],
    ];
    protected static $validationRules = [
        'id_historia_clinica' => 'required|integer|exists:historia_clinica,id_historia_clinica',
        'id_medicamento' => 'required|integer|exists:medicamento,id_medicamento',
        'dosis' => 'required|string|max:255',
        'precio' => 'required|numeric',
        'fecha' => 'required|date',
    ];
    protected static $tableColumns = [
        ['ID', 'id_historia_clinica_medicamento'],
        ['HISTORIA CLINICA', 'id_historia_clinica'],
        ['ID MEDICAMENTO', 'id_medicamento'],
        ['MEDICAMENTO', 'nombre_medicamento'],
        ['DOSIS', 'dosis'],
        ['PRECIO S/', 'precio'],
        ['FECHA', 'fecha'],
        ['FECHA REGISTRO', 'created_at'],
    ];
    protected $appends = ['nombre_medicamento'];
    public static function getQuery()
    {
        $al1 = (new self)->getTable();
        $query = DB::table($al1)
            ->leftJoin('medicamento', 'medicamento.id_medicamento', '=', "{$al1}.id_medicamento")
            ->select([
                "{$al1}.id_historia_clinica_medicamento",
                "{$al1}.id_historia_clinica",
                "medicamento.medicamento as nombre_medicamento",
                "{$al1}.id_medicamento",
                "{$al1}.dosis",
                "{$al1}.precio",
                "{$al1}.fecha",
                "{$al1}.created_at",
            ]);
        return ['query' => $query, 'alias' => $al1];
    }
    public function medicamento()
    {
        return $this->belongsTo(Medicamento::class, 'id_medicamento');
    }
    public function getNombreMedicamentoAttribute()
    {
        return $this->medicamento->medicamento ?? null;
    }
    public function parent()
    {
        return $this->belongsTo(HistoriaClinica::class, $this->parentForeignKey, 'id');
    }
}