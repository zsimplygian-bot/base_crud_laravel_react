<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
abstract class BaseController extends Controller
{
    protected string $view;
    protected string $title = '';
    protected string $custom_title = '';
    protected string $width_index = 'md';
    protected string $width_form = 'md';
    protected string $model;
    protected $listaController;
    public function __construct()
    {
        $this->listaController = app(ListaController::class);
        if (!empty($this->model)) {
            $instance = $this->getModelInstance();
            $this->view = $instance->getTable();
            $this->title = $this->custom_title = $this->getModelTitle($instance);
        }
    }
    public function index(Request $request)
    {
        return Inertia::render("{$this->view}/index", [
            'success'       => session('success'),
            'campos'        => $this->model::getColumns(),
            'custom_title'  => $this->custom_title,
            'title'         => $this->title,
            'view'          => $this->view,
            'width_index'   => $this->width_index,
            'toolbarfields' => $this->model::getToolbarFields($this->listaController),
            'footerFields'  => $this->model::getFooterFields(),
            'queryparams'   => $this->getValidatedQueryParams($request),
        ]);
    }
    public function handleAction(string $action, ?int $id = null)
    {
        $isCreate = $action === 'create';
        $record = $isCreate ? $this->getModelInstance() : $this->model::find($id);
        if (!$isCreate && !$record) {
            return redirect()->route("{$this->view}.index")->with('error', 'Registro no encontrado');
        }
        $formFields = $this->model::getFormFields($this->listaController, $record, $action);
        $formData = $isCreate
            ? collect($formFields)->mapWithKeys(fn ($f, $k) => [$k => $f['value'] ?? null])->toArray()
            : $record->toArray();
        return Inertia::render("{$this->view}/form", [
            'form_data'     => $formData,
            'action'        => $action,
            'formFields'    => $formFields,
            'sheetFields'   => [],
            'custom_title'  => $this->custom_title,
            'title'         => $this->title,
            'view'          => $this->view,
            'width_form'    => $this->width_form,
            'queryparams'   => $this->getValidatedQueryParams(request()),
            'toggleOptions' => method_exists($this->model, 'getToggleOptions') ? $this->model::getToggleOptions() : null,
            'apiConfig'     => $this->model::getApiConfig(),
            'success'       => session('success'),
        ]);
    }
    public function store(Request $request)
    {
        $data = $this->validateRequest($request);
        // Normalizar fechas ISO 8601 antes de guardar
        $data = $this->normalizeDateFields($data);
        $model = $this->getModelInstance();
        $this->handleFileUploads($request, $model, $data);
        $model->fill($data);
        $model->creater_id = auth()?->id();
        $model->save();
        return $this->redirectAfterAction('create');
    }
    public function update(Request $request, $id)
    {
        $model = $this->model::findOrFail($id);
        $data = $this->validateRequest($request);
        // Normalizar fechas ISO 8601 antes de guardar
        $data = $this->normalizeDateFields($data);
        $this->handleFileUploads($request, $model, $data);
        $model->fill($data);
        $model->updater_id = auth()?->id();
        $model->save();
        return $this->redirectAfterAction('update');
    }
    public function destroy($id)
    {
        $this->model::findOrFail($id)->delete();
        return $this->redirectAfterAction('delete');
    }
    protected function validateRequest(Request $request): array
    {
        return $request->validate($this->model::getValidationRules());
    }
    protected function getValidatedQueryParams(Request $request): array
    {
        return method_exists($this->model, 'getQueryParams')
            ? $this->model::getQueryParams()
            : [];
    }
    protected function redirectAfterAction(string $action, array $extraParams = []): \Illuminate\Http\RedirectResponse
    {
        if (method_exists($this->model, 'getQueryParams')) {
            foreach ($this->model::getQueryParams() as $param) {
                if (request()->has($param)) {
                    $extraParams[$param] = request()->input($param);
                }
            }
        }
        return redirect()
            ->route("{$this->view}.index", $extraParams)
            ->with('success', $this->getSuccessMessage($action));
    }
    protected function getSuccessMessage(string $action): string
    {
        return [
            'create' => 'Registro creado exitosamente.',
            'update' => 'Registro actualizado exitosamente.',
            'delete' => 'Registro eliminado exitosamente.',
        ][$action] ?? 'Acción realizada exitosamente.';
    }
    protected function getModelInstance()
    {
        return new $this->model();
    }
    protected function getModelTitle($modelInstance): string
    {
        return property_exists($this->model, 'title') ? $this->model::$title : ($this->title ?: class_basename($modelInstance));
    }
    // Maneja archivos enviados en los formularios (ej: imágenes)
    protected function handleFileUploads(Request $request, $model, array &$data): void
    {
        foreach ($this->model::getValidationRules() as $field => $rules) {
            if ($request->hasFile($field) && $request->file($field)->isValid()) {
                $file = $request->file($field);
                $filename = $field . '_' . time() . '.' . $file->getClientOriginalExtension();
                $destinationPath = public_path("images/{$this->view}");
                if (!is_dir($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }
                $file->move($destinationPath, $filename);
                $data[$field] = $filename;
            }
        }
    }
    // Convierte fechas ISO 8601 a formato MySQL (Y-m-d H:i:s)
    protected function normalizeDateFields(array $data): array
    {
        foreach ($data as $key => $value) {
            if (is_string($value) && preg_match('/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/', $value)) {
                try {
                    $date = Carbon::parse($value);
                    $data[$key] = $date->format('Y-m-d H:i:s');
                } catch (\Exception $e) {
                    // Opcional: Log::warning("Fecha inválida: $value en el campo $key");
                }
            }
        }
        return $data;
    }
}