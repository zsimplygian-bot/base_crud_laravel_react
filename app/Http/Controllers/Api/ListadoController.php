<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Helpers\{
    ListadoHelper,
    ListadoQueryBuilder,
    ModelRegistry
};
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
            'to'        => 'date|nullable|after_or_equal:from',
            'tipo'      => 'string|nullable',
        ], [
            'view.required' => 'El parámetro "view" es obligatorio.'
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $viewParam = $request->input('view');
        $tipo = $request->input('tipo');
        try {
            $instance = ModelRegistry::resolve($viewParam, $tipo);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
        $realView = in_array($viewParam, ['honora', 'pagomen', 'consultasan']) ? 'detalle_liquidacion' : $viewParam;
        $built = $instance::getQuery($request->input('search'), $tipo ?? $viewParam);
        $query = $built['query'];
        $alias = $built['alias'];
        $query = ListadoQueryBuilder::apply($query, $alias, $request, $instance, $realView);
        $data = $query->paginate(
            $request->input('limit', 10),
            ['*'],
            'page',
            $request->input('page', 1)
        );
        return response()->json([
            'data'         => $data->items(),
            'total'        => $data->total(),
            'current_page' => $data->currentPage(),
            'per_page'     => $data->perPage(),
            'last_page'    => $data->lastPage(),
        ]);
    }
}