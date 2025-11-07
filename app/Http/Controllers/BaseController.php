<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Intervention\Image\Laravel\Facades\Image;
use Illuminate\Validation\ValidationException;
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
            $instance = new $this->model();
            $this->view = $instance->getTable();
            $this->title = $this->custom_title = $this->getModelTitle($instance);
        }
    }
    // INDEX
    public function index(Request $request)
    {
        $model = new $this->model();
        return Inertia::render("{$this->view}/index", [
            'success'       => session('success'),
            'campos'        => $model::getColumns(),
            'custom_title'  => $this->custom_title,
            'title'         => $this->title,
            'view'          => $this->view,
            'width_index'   => $this->width_index,
            'toolbarfields' => $model::getToolbarFields($this->listaController),
            'footerFields'  => $model::getFooterFields(),
        ]);
    }
    // FORM
    public function handleAction(string $action, ?int $id = null)
    {
        $record = $action === 'create' ? new $this->model() : $this->model::find($id);
        if (!$record) return back()->with('error', 'Registro no encontrado');
        $formFields = $this->model::getFormFields($this->listaController, $record, $action);

        $formData = $action === 'create'
            ? array_map(fn($f) => $f['value'] ?? null, $formFields)
            : $record->toArray();
        $extraData = method_exists($this, 'extraFormData')
            ? $this->extraFormData($record, $action)
            : [];
        return Inertia::render("{$this->view}/form", array_merge([
            'form_data'     => $formData,
            'action'        => $action,
            'formFields'    => $formFields,
            'custom_title'  => $this->custom_title,
            'title'         => $this->title,
            'view'          => $this->view,
            'width_form'    => $this->width_form,
            'toggleOptions' => method_exists($this->model, 'getToggleOptions')
                ? $this->model::getToggleOptions()
                : null,
            'apiConfig'     => $this->model::getApiConfig(),
            'success'       => session('success'),
        ], $extraData));
    }
    // STORE / UPDATE unificados
    public function store(Request $request) { return $this->persist($request); }
    public function update(Request $request, $id) { return $this->persist($request, $id); }
    protected function persist(Request $request, $id = null)
    {
        $data = $this->validateData($request);
        // ✅ Hook: validación extra definida en el controlador hijo
        if (method_exists($this, 'validateExtra')) {
            $this->validateExtra($request, $id);
        }
        $this->normalizeData($data);
        $model = $id ? $this->model::findOrFail($id) : new $this->model();
        $model->fill($data);
        $model->{$id ? 'updater_id' : 'creater_id'} = auth()?->id();
        $model->save();
        $this->processFileUploads($request, $model);
        if ($this->view === 'historia_clinica' && !$id) {
            return redirect("/{$this->view}/form/update/{$model->getKey()}")
                ->with('success', 'Registro creado exitosamente.');
        }
        return $this->redirectAfterAction($id ? 'update' : 'create');
    }
    // DELETE
    public function destroy($id)
    {
        $model = $this->model::findOrFail($id);
        // Extra delete del controlador hijo, si existe
        if (method_exists($this, 'deleteExtra')) {
            $this->deleteExtra($model);
        }
        $this->deleteFileIfExists($model, 'imagen');
        $model->delete();
        return $this->redirectAfterAction('delete');
    }
    // UTILIDADES
    protected function validateData(Request $request): array
    {
        // Si existe 'data', tomamos ese array; si no, todo el request
        $input = $request->input('data', $request->all());
        // Validamos usando Validator explícitamente
        return \Validator::make($input, $this->model::getValidationRules(), [
            'required' => 'El campo :attribute es requerido.',
            'string'   => 'El campo :attribute debe ser texto.',
            'int'      => 'El campo :attribute debe ser un número entero.',
            'numeric'  => 'El campo :attribute debe ser numérico.',
            'date'     => 'El campo :attribute debe ser una fecha válida.',
            'image'    => 'El campo :attribute debe ser una imagen.',
            'mimes'    => 'El campo :attribute debe ser de tipo: :values.',
            'max'      => 'El campo :attribute no debe superar :max caracteres.',
            'after_or_equal' => 'La fecha debe ser mayor o igual a la fecha actual.',
        ])->validate();
    }
    protected function normalizeData(array &$data): void
    {
        foreach ($data as $key => $value) {
            if (is_string($value) && str_contains($value, 'T')) {
                $data[$key] = Carbon::parse($value)->format('Y-m-d H:i:s');
            } elseif (is_array($value)) {
                $data[$key] = json_encode($value);
            }
        }
    }
    protected function processFileUploads(Request $request, $model): void
    {
        foreach ($request->files as $field => $file) {
            if (!$file?->isValid()) continue;
            $path = public_path("images/{$this->view}");
            if (!is_dir($path)) mkdir($path, 0755, true);
            $filename = "{$model->getKey()}.jpg";
            $image = Image::read($file);
            if ($image->width() > 1024) $image->scale(1024);
            $image->toJpeg(90)->save("{$path}/{$filename}");
            $model->{$field} = $filename;
        }
        $model->save();
    }
    protected function deleteFileIfExists($model, string $field)
    {
        $file = public_path("images/{$this->view}/{$model->{$field}}");
        if (is_file($file)) unlink($file);
    }
    protected function redirectAfterAction(string $action)
    {
        $message = match ($action) {
            'create' => 'Registro creado exitosamente.',
            'update' => 'Registro actualizado exitosamente.',
            'delete' => 'Registro eliminado exitosamente.',
            default  => 'Acción realizada exitosamente.',
        };
        $view = $this->view ?? ''; // ej: historia_clinica_procedimiento
        if (str_starts_with($view, 'historia_clinica_')) {
            return back()->with([
                'success' => $message,
                '_reload' => true, // si tu JS lo usa para refrescar
            ]);
        }
        if ($view === 'historia_clinica') {
            return redirect()->route("{$view}.index")->with('success', $message);
        }
        return redirect()->route("{$view}.index")->with('success', $message);
    }
    protected function getModelTitle($m): string
    {
        return $this->model::$title ?? class_basename($m);
    }
}