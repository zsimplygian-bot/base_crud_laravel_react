<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Helpers\{ListadoHelper, ListadoQueryBuilder, ModelRegistry};
use Illuminate\Support\Facades\Validator;
class ListadoController extends Controller
{
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'limit'     => 'integer|min:1',
            'page'      => 'integer|min:1',
            'view'      => 'required|string',
            'sortOrder' => 'in:asc,desc',
            'column'    => 'string|nullable',
            'search'    => 'string|nullable',
            'from'      => 'date|nullable',
            'to'        => 'date|nullable|after_or_equal:from'
        ], [
            'view.required' => 'El parámetro "view" es obligatorio.'
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $params = array_merge([
            'limit'     => 10,
            'page'      => 1,
            'sortOrder' => null,
            'column'    => null,
            'search'    => null,
            'from'      => null,
            'to'        => null
        ], $request->only(['limit','page','view','sortOrder','column','search','from','to']));
        try {
            $instance = ModelRegistry::resolve($params['view']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['errors' => ['view' => $e->getMessage()]], 400);
        }
        $columns = $instance::getColumns();
        $realView = match ($params['view']) {
            'honora','pagomen','consultasan' => 'detalle_liquidacion',
            default => $params['view']
        };
        $built = $instance::getQuery($params['search'], $params['view']);
        $query = ListadoQueryBuilder::apply($built['query'], $built['alias'], $request, $instance, $realView);
        $data = $query->paginate($params['limit'], ['*'], 'page', $params['page']);
        $params['total']        = $data->total();
        $params['current_page'] = $data->currentPage();
        $params['per_page']     = $data->perPage();
        $params['last_page']    = $data->lastPage();
        $params['resolved']     = ['realView' => $realView, 'alias' => $built['alias']];
        return response()->json([
            'columns' => $columns,
            'data'    => $data->items(),
            'params'  => $params
        ]);
    }
}