<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\ItemSimple;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
class ItemSimpleController extends Controller
{
    protected $model = ItemSimple::class;
    public function index(Request $request)
    {
        $tipo = $this->extractTipo($request);
        $model = ItemSimple::forTipo($tipo);
        $items = $model->newQuery()->get();
        $title = ItemSimple::getTitleForTipo($tipo);
        return Inertia::render('itemsimple/index', [
            'success'      => session('success'),
            'items'        => $items,
            'title'        => $title,
            'custom_title' => $title,
            'view'         => 'itemsimple',
            'queryparams'  => $tipo,
            'width_index'  => 'w-1/2',
            'campos'       => ItemSimple::getTableColumns($tipo),
            'queryparams'  => ['tipo' => $tipo], // ✅ así
        ]);
    }
    public function handleAction(Request $request, $action, $id = null)
    {
        $tipo = $this->extractTipo($request);
        $model = ItemSimple::forTipo($tipo);
        $formFields = ItemSimple::getFieldDefinitionsForTipo($tipo);
        $title = ItemSimple::getTitleForTipo($tipo);
        if ($action === 'create') {
            $form_data = collect($formFields)->mapWithKeys(fn($f, $k) => [$k => $f['form']['value'] ?? null])->toArray();
        } else {
            $record = $model->find($id);
            if (!$record) {
                return $this->redirectTipo('Registro no encontrado', $tipo, 'error');
            }
            $form_data = [
                $model->getKeyName() => $record->{$model->getKeyName()},
                'tipo'               => $tipo,
                $tipo                => $record->item,
            ];
        }
        return Inertia::render('itemsimple/form', [
            'form_data'    => $form_data,
            'action'       => $action,
            'formFields'   => $formFields,
            'custom_title' => $title,
            'title'        => $title,
            'view'         => 'itemsimple',
            'width_form'   => 'w-1/3',
            'queryparams'  => $tipo,
            'id'           => $id,
        ]);
    }
    public function store(Request $request)
    {
        return $this->saveOrUpdate($request);
    }
    public function update(Request $request, $id)
    {
        return $this->saveOrUpdate($request, $id);
    }
    public function destroy(Request $request, $id)
    {
        $tipo = $this->extractTipo($request);
        $model = ItemSimple::forTipo($tipo);
        $deleted = DB::table($model->getTable())->where($model->getKeyName(), $id)->delete();
        $msg = $deleted ? 'Registro eliminado exitosamente.' : 'No se pudo eliminar el registro.';
        $type = $deleted ? 'success' : 'error';
        return $this->redirectTipo($msg, $tipo, $type);
    }
    private function saveOrUpdate(Request $request, ?int $id = null)
    {
        $tipo = $this->extractTipo($request);
        $model = ItemSimple::forTipo($tipo);
        $validated = $request->validate($model::getValidationRules($tipo));
        $data = [$tipo => $validated[$tipo]];
        if ($id) {
            $affected = DB::table($model->getTable())->where($model->getKeyName(), $id)->update($data);
            $msg = $affected ? 'Registro actualizado exitosamente.' : 'No se pudo actualizar el registro.';
        } else {
            DB::table($model->getTable())->insert($data);
            $msg = 'Registro creado exitosamente.';
        }
        return $this->redirectTipo($msg, $tipo);
    }
    private function redirectTipo(string $mensaje, string $tipo, string $flashType = 'success')
    {
        return redirect()->route('itemsimple.index', ['tipo' => $tipo])->with($flashType, $mensaje);
    }
    private function extractTipo(Request $request): string
    {
        $tipo = $request->input('tipo') ?? $request->query('tipo');
        abort_unless($tipo, 400, 'Tipo no especificado');
        return $tipo;
    }
}