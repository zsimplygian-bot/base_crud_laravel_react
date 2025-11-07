<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\HistoriaClinicaSeguimiento;
use App\Models\HistoriaClinicaProcedimiento;
use App\Models\HistoriaClinicaMedicamento;
use App\Models\HistoriaClinicaAnamnesis;
use App\Models\HistoriaClinica;
use App\Http\Controllers\ListaController;
class HistoriaClinicaFieldsController extends Controller
{
    protected ListaController $listaController;
    public function __construct(ListaController $listaController)
    {
        $this->listaController = $listaController;
    }
    public function fields(Request $request, $tipo)
    {
        $map = [
            'seguimientos'   => HistoriaClinicaSeguimiento::class,
            'procedimientos' => HistoriaClinicaProcedimiento::class,
            'medicamentos'   => HistoriaClinicaMedicamento::class,
            'anamnesis'      => HistoriaClinicaAnamnesis::class,
        ];
        if (!isset($map[$tipo])) {
            return response()->json([], 404);
        }
        $model = $map[$tipo];
        $fields = $model::getModalFields($this->listaController, null, 'create');
        return response()->json($fields);
    }
    public function records($id)
    {
        $record = HistoriaClinica::find($id);
        if (!$record) {
            return response()->json([
                'seguimientos' => [],
                'procedimientos' => [],
                'medicamentos' => [],
                'anamnesis' => [],
            ]);
        }
        $map = [
            'seguimientos'   => HistoriaClinicaSeguimiento::class,
            'procedimientos' => HistoriaClinicaProcedimiento::class,
            'medicamentos'   => HistoriaClinicaMedicamento::class,
            'anamnesis'      => HistoriaClinicaAnamnesis::class,
        ];
        $result = [];
        foreach ($map as $key => $modelClass) {
            $instance = new $modelClass;
            // query usando getQuery()
            if (method_exists($modelClass, 'getQuery')) {
                $queryData = $modelClass::getQuery();
                $alias = $queryData['alias'];
                $query = $queryData['query']
                    ->where("{$alias}.id_historia_clinica", $id)
                    ->orderBy("{$alias}.created_at", 'asc')
                    ->get();
            } else {
                $relationMethod = 'historia_' . $key;
                $query = $record->$relationMethod()->orderBy('created_at', 'asc')->get();
            }
            // columnas
            $tableColumns = $modelClass::getColumns(); // ← devuelve ['title', 'column']
            // transformar registros para frontend
            $records = $query->map(function ($item) use ($tableColumns) {
                return collect($tableColumns)->map(function ($col) use ($item) {
                    $column = $col['column']; // este es el key real
                    $label  = $col['title'];  // este es el label para mostrar
                    $value  = $item->{$column} ?? null;
                    return [
                        'key'   => $column,   // ← AGREGADO
                        'label' => $label,
                        'value' => $value,
                    ];

                })->toArray();

            });
            $result[$key] = $records;
        }
        return response()->json($result);
    }
}