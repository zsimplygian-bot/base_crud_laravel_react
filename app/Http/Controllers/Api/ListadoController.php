<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Helpers\ListadoQueryBuilder;
use App\Helpers\ModelRegistry;
use Illuminate\Support\Facades\Validator;
class ListadoController extends Controller
{
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'view'      => 'required|string',
            'limit'     => 'integer|min:1',
            'page'      => 'integer|min:1',
            'sortBy'    => 'string|nullable',
            'sortOrder' => 'in:asc,desc',
            'search'    => 'string|nullable',
            'column'    => 'string|nullable',
            'filters'   => 'array|nullable',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $params = array_merge([
            'limit'     => 10,
            'page'      => 1,
            'sortBy'    => 'id',
            'sortOrder' => 'desc',
            'filters'   => [],
        ], $request->only([
            'limit','page','view','sortBy','sortOrder','search','column','filters'
        ]));

        $instance = ModelRegistry::resolve($params['view']);
        $built = $instance::getQuery();

        $query = ListadoQueryBuilder::apply(
            $built['query'],
            $built['alias'],
            $request,
            $instance,
            $params['view']
        );

        $data = $query->paginate(
            $params['limit'],
            ['*'],
            'page',
            $params['page']
        );

        // SQL REAL (solo para debug)
        $sqlRaw = vsprintf(
            str_replace('?', "'%s'", $query->toSql()),
            $query->getBindings()
        );

        return response()->json([
            'columns' => $instance::getColumns(),
            'data'    => $data->items(),
            'params'  => [
                'total'        => $data->total(),
                'current_page' => $data->currentPage(),
                'per_page'     => $data->perPage(),
                'last_page'    => $data->lastPage(),
            ],
            'debug' => [
                'filters_applied' => $request->input('filters', []),
                'sql'             => $sqlRaw,
                'bindings'        => $query->getBindings(),
            ]
        ]);
    }
}
