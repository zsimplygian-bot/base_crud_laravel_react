<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Intervention\Image\Laravel\Facades\Image;
abstract class BaseController extends Controller
{
    protected string $view;
    protected string $model;
    public function __construct()
    {
        if (!empty($this->model)) {
            $this->view = (new $this->model())->getTable();
        }
    }
    // INDEX
    public function index(Request $request)
    {
        $model = new $this->model();
        return Inertia::render("{$this->view}/index", [
            'success' => session('success'),
            'view'    => $this->view,
            'toolbarfields' => $model::getToolbarFields(),
            'footerFields'  => $model::getFooterFields(),
        ]);
    }
    // FORM
    public function handleAction(string $action, ?int $id = null)
    {
        $record = $action === 'create'
            ? new $this->model()
            : $this->model::findOrFail($id);
        $formFields = $this->model::getFormFields($record, $action);
        $formData = $action === 'create'
            ? array_map(fn($f) => $f['value'] ?? $f['default'] ?? null, $formFields)
            : $record->toArray();
        return Inertia::render("{$this->view}/form", [
            'action'     => $action,
            'view'       => $this->view,
            'formFields' => $formFields,
            'form_data'  => $formData,
            'success'    => session('success'),
        ]);
    }
    // STORE / UPDATE
    public function store(Request $request) { return $this->persist($request); }
    public function update(Request $request, $id) { return $this->persist($request, $id); }
    protected function persist(Request $request, $id = null)
{
    
    $data = $this->validateData($request);

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
        $input = $request->input('data', $request->all());
        return \Validator::make($input, $this->model::getValidationRules(), [
            'required'        => 'El campo :attribute es requerido.',
            'string'          => 'El campo :attribute debe ser texto.',
            'int'             => 'El campo :attribute debe ser un número entero.',
            'numeric'         => 'El campo :attribute debe ser numérico.',
            'date'            => 'El campo :attribute debe ser una fecha válida.',
            'image'           => 'El campo :attribute debe ser una imagen.',
            'mimes'           => 'El campo :attribute debe ser de tipo: :values.',
            'max'             => 'El campo :attribute no debe superar :max caracteres.',
            'after_or_equal'  => 'La fecha debe ser mayor o igual a la fecha actual.',
        ])->validate();
    }
    protected function normalizeData(array &$data): void
    {
        $dateFields = ['created_at', 'updated_at', 'fecha', 'fecha_nacimiento', 'fecha_vencimiento'];
        foreach ($data as $key => $value) {
            if (in_array($key, $dateFields) && is_string($value) && str_contains($value, 'T')) {
                try {
                    $data[$key] = Carbon::parse($value)->format('Y-m-d H:i:s');
                } catch (\Exception $e) {
                    \Log::warning("Fecha inválida en {$key}: {$value}");
                }
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
        $view = $this->view ?? '';
        if (str_starts_with($view, 'historia_clinica_')) {
            return back()->with(['success' => $message, '_reload' => true]);
        }
        return redirect()->route("{$view}.index")->with('success', $message);
    }
}