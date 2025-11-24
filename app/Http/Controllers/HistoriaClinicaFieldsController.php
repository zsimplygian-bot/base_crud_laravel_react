<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\HistoriaClinicaSeguimiento;
use App\Models\HistoriaClinicaProcedimiento;
use App\Models\HistoriaClinicaMedicamento;
use App\Models\HistoriaClinicaAnamnesis;
use App\Models\HistoriaClinica;
class HistoriaClinicaFieldsController extends Controller
{
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
        $fields = $model::getModalFields(null, 'create');
        return response()->json($fields);
    }
    public function records($id)
    {
        $record = HistoriaClinica::find($id);
        if (!$record) {
            return response()->json([
                'seguimientos'   => [],
                'procedimientos' => [],
                'medicamentos'   => [],
                'anamnesis'      => [],
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
            // query usando getQuery si existe
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
            $tableColumns = $modelClass::getColumns();
            // transformar registros para frontend
            $records = $query->map(function ($item) use ($tableColumns) {
                return collect($tableColumns)->map(function ($col) use ($item) {
                    $column = $col['accessor'];
                    $label  = $col['header'];
                    $value  = $item->{$column} ?? null;
                    return [
                        'key'   => $column,
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