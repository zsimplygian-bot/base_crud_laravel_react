<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class HistoriaClinicaSeguimiento extends BaseModel
{
    use HasFactory;
    protected $table = 'historia_clinica_seguimiento';
    public static string $title = 'Seguimiento';
    protected static $simpleModalFormFieldDefinitions = [
        ['id_historia_clinica', 'HISTORIA', 'text', 'required'],
        ['detalle', 'DETALLE', 'textarea', 'required'],
        ['observaciones', 'OBSERVACIONES', 'textarea'],
        ['fecha', 'FECHA', 'date', 'required'],
    ];
    protected static $validationRules = [
        'id_historia_clinica' => 'required|integer|exists:historia_clinica,id_historia_clinica',
        'detalle' => 'required|string',
        'observaciones' => 'nullable|string',
        'fecha' => 'required|date',
    ];
    protected static $tableColumns = [
        ['ID', 'id_historia_clinica_seguimiento'],
        ['HISTORIA CLINICA', 'id_historia_clinica'],
        ['DETALLE', 'detalle'],
        ['OBSERVACIONES', 'observaciones'],
        ['FECHA', 'fecha'],
        ['FECHA REGISTRO', 'created_at'],
    ];
    public static function getQuery()
    {
        $al1 = (new self)->getTable();
        $query = DB::table($al1)
            ->select([
                "{$al1}.id_historia_clinica_seguimiento",
                "{$al1}.id_historia_clinica",
                "{$al1}.detalle",
                "{$al1}.observaciones",
                "{$al1}.fecha",
                "{$al1}.created_at",
            ]);
        return ['query' => $query, 'alias' => $al1];
    }
    public function parent()
    {
        return $this->belongsTo(HistoriaClinica::class, $this->parentForeignKey, 'id');
    }
}