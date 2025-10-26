<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Intervention\Image\Laravel\Facades\Image;

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

    /* ===========================
       INDEX
       =========================== */
    public function index(Request $request)
    {
        $model = $this->getModelInstance();
        return Inertia::render("{$this->view}/index", [
            'success'       => session('success'),
            'campos'        => $model::getColumns(),
            'custom_title'  => $this->custom_title,
            'title'         => $this->title,
            'view'          => $this->view,
            'width_index'   => $this->width_index,
            'toolbarfields' => $model::getToolbarFields($this->listaController),
            'footerFields'  => $model::getFooterFields(),
            'queryparams'   => $this->getValidatedQueryParams($request),
        ]);
    }

    /* ===========================
       FORM ACTION HANDLER
       =========================== */
    public function handleAction(string $action, ?int $id = null)
    {
        $isCreate = $action === 'create';
        $record = $isCreate ? $this->getModelInstance() : $this->model::find($id);

        if (!$isCreate && !$record) {
            return back()->with('error', 'Registro no encontrado');
        }

        $formFields = $this->model::getFormFields($this->listaController, $record, $action);
        $formData = $isCreate
            ? collect($formFields)->mapWithKeys(fn($f, $k) => [$k => $f['value'] ?? null])->toArray()
            : $record->toArray();

        $extraData = method_exists($this, 'extraFormData') ? $this->extraFormData($record, $action) : [];

        return Inertia::render("{$this->view}/form", array_merge([
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
        ], $extraData));
    }

    /* ===========================
       CRUD
       =========================== */
   public function store(Request $request)
{
    $data = $this->validateData($request);
    $this->normalizeData($data);

    $model = $this->getModelInstance();
    $model->fill($data);
    $model->creater_id = auth()?->id();
    $model->save();

    $this->processFileUploads($request, $model, $data);

    if ($this->view === 'historia_clinica') {
        $id = $model->getKey();
        return redirect("/{$this->view}/form/update/{$id}")
            ->with('success', 'Registro creado exitosamente.');
    }

    return $this->redirectAfterAction('create');
}



    public function update(Request $request, $id)
    {
        $model = $this->model::findOrFail($id);
        return $this->saveRecord($request, $model, 'update');
    }

    public function destroy($id)
    {
        $model = $this->model::findOrFail($id);

        // Si es historia_clinica, eliminar dependencias
        if ($this->view === 'historia_clinica') {
            $idHistoria = $model->getKey();

            \App\Models\HistoriaClinicaSeguimiento::where('id_historia_clinica', $idHistoria)->delete();
            \App\Models\HistoriaClinicaAnamnesis::where('id_historia_clinica', $idHistoria)->delete();
            \App\Models\HistoriaClinicaProcedimiento::where('id_historia_clinica', $idHistoria)->delete();
            \App\Models\HistoriaClinicaMedicamento::where('id_historia_clinica', $idHistoria)->delete();
        }

        $this->deleteFileIfExists($model, 'imagen');
        $model->delete();

        return $this->redirectAfterAction('delete');
    }

    /* ===========================
       HELPERS
       =========================== */
    protected function saveRecord(Request $request, $model, string $action)
    {
        $data = $this->validateData($request);
        $this->normalizeData($data);
        $model->fill($data);

        if ($action === 'create') {
            $model->creater_id = auth()?->id();
        } else {
            $model->updater_id = auth()?->id();
        }

        $model->save();
        $this->processFileUploads($request, $model, $data);

        return $this->redirectAfterAction($action);
    }

    protected function deleteFileIfExists($model, string $field)
    {
        if (!empty($model->{$field})) {
            $filePath = public_path("images/{$this->view}/{$model->{$field}}");
            if (is_file($filePath)) unlink($filePath);
        }
    }

    protected function redirectAfterAction(string $action): \Illuminate\Http\RedirectResponse
    {
        return redirect()
            ->route("{$this->view}.index")
            ->with('success', $this->getSuccessMessage($action));
    }

    protected function validateData(Request $request): array
    {
        $rules = $this->model::getValidationRules();
        $fileField = 'imagen';
        if ($request->hasFile($fileField)) {
            $rules[$fileField] = 'file|image|mimes:jpeg,png,jpg,gif|max:2048';
        }
        return $request->validate($rules);
    }

    protected function normalizeData(array &$data): void
    {
        foreach ($data as $key => $value) {
            if (is_string($value) && preg_match('/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/', $value)) {
                try {
                    $data[$key] = Carbon::parse($value)->format('Y-m-d H:i:s');
                } catch (\Throwable) {}
            } elseif (is_array($value)) {
                $data[$key] = json_encode($value);
            }
        }
    }

    protected function processFileUploads(Request $request, $model, array &$data): void
    {
        foreach ($request->files as $field => $file) {
            if (!$file || !$file->isValid()) continue;

            $filename = $model->getKey() . '.jpg';
            $path = public_path("images/{$this->view}");
            if (!is_dir($path)) mkdir($path, 0755, true);

            $image = Image::read($file);
            if ($image->width() > 1024) $image->scale(1024);

            $image->toJpeg(90)->save("{$path}/{$filename}");
            $model->{$field} = $filename;
            $model->save();
        }
    }

    protected function getModelInstance()
    {
        return new $this->model();
    }

    protected function getModelTitle($modelInstance): string
    {
        return property_exists($this->model, 'title')
            ? $this->model::$title
            : ($this->title ?: class_basename($modelInstance));
    }

    protected function getValidatedQueryParams(Request $request): array
    {
        return method_exists($this->model, 'getQueryParams')
            ? $this->model::getQueryParams()
            : [];
    }

    protected function getSuccessMessage(string $action): string
    {
        return match ($action) {
            'create' => 'Registro creado exitosamente.',
            'update' => 'Registro actualizado exitosamente.',
            'delete' => 'Registro eliminado exitosamente.',
            default  => 'Acción realizada exitosamente.',
        };
    }
}
