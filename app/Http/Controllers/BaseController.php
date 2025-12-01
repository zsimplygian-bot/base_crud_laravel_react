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

    public function index(Request $request)
    {
        $model = new $this->model();

        return Inertia::render("{$this->view}/index", [
            'success'       => session('success'),
            'view'          => $this->view,
            'toolbarfields' => $model::getToolbarFields(),
            'footerFields'  => $model::getFooterFields(),
        ]);
    }

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

    public function store(Request $request)
    {
        return $this->persist($request);
    }

    public function update(Request $request, $id)
    {
        return $this->persist($request, $id);
    }

    protected function persist(Request $request, $id = null)
    {
        $backto = $request->input('backto')
            ?? $request->input('data.backto')
            ?? null;

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

        return $this->redirectAfterAction($id ? 'update' : 'create', $backto);
    }

    public function destroy($id)
    {
        $model = $this->model::findOrFail($id);

        if (method_exists($this, 'deleteExtra')) {
            $this->deleteExtra($model);
        }

        // Borra tanto PDF como imagen
        $this->deleteFileIfExists($model, 'archivo');

        $model->delete();

        $backto = request()->input('backto')
            ?? request()->input('data.backto')
            ?? null;

        return $this->redirectAfterAction('delete', $backto);
    }

    protected function validateData(Request $request): array
    {
        $input = $request->input('data', $request->all());
        return \Validator::make($input, $this->model::getValidationRules())->validate();
    }

    protected function normalizeData(array &$data): void
    {
        $dateFields = [
            'created_at', 'updated_at', 'fecha',
            'fecha_nacimiento', 'fecha_vencimiento'
        ];

        foreach ($data as $key => $value) {
            if (in_array($key, $dateFields) && is_string($value) && str_contains($value, 'T')) {
                $data[$key] = Carbon::parse($value)->format('Y-m-d H:i:s');
            } elseif (is_array($value)) {
                $data[$key] = json_encode($value);
            }
        }
    }

    /**
     * Procesa subida de archivos (PDF o imagen)
     * - Borra archivo anterior si cambia de tipo
     * - Guarda en la carpeta correcta
     */
    protected function processFileUploads(Request $request, $model): void
    {
        if (!$request->hasFile('archivo')) {
            return; // No hay archivo subido
        }

        $file = $request->file('archivo');
        if (!$file->isValid()) {
            return;
        }

        $extension = strtolower($file->getClientOriginalExtension());
        $currentFile = $model->archivo ?? null; // archivo actual en BD

        // === 1. BORRAR ARCHIVO ANTERIOR (si existe y es diferente tipo) ===
        if ($currentFile) {
            $this->deleteFileIfExists($model, 'archivo');
        }

        // === 2. GUARDAR PDF ===
        if ($extension === 'pdf') {
            $path = public_path("pdf/{$this->view}");
            if (!is_dir($path)) {
                mkdir($path, 0755, true);
            }

            $filename = "{$model->getKey()}.pdf";
            $file->move($path, $filename);

            $model->archivo = $filename;
            $model->save();
            return;
        }

        // === 3. GUARDAR IMAGEN (siempre como .jpg) ===
        if (in_array($extension, ['jpg', 'jpeg', 'png', 'webp', 'gif'])) {
            $path = public_path("images/{$this->view}");
            if (!is_dir($path)) {
                mkdir($path, 0755, true);
            }

            $image = Image::read($file);

            if ($image->width() > 1024) {
                $image->scale(width: 1024);
            }

            $filename = "{$model->getKey()}.jpg";
            $image->toJpeg(90)->save("{$path}/{$filename}");

            $model->archivo = $filename;
            $model->save();
            return;
        }

        throw new \Exception("Tipo de archivo no permitido: {$extension}");
    }

    /**
     * Borra archivo físico (tanto en /pdf/ como en /images/)
     */
    protected function deleteFileIfExists($model, string $field): void
    {
        $filename = $model->{$field} ?? null;
        if (!$filename) {
            return;
        }

        // Intentar borrar en /pdf/
        $pdfPath = public_path("pdf/{$this->view}/{$filename}");
        if (is_file($pdfPath)) {
            @unlink($pdfPath);
            return;
        }

        // Intentar borrar en /images/ (con extensión original o .jpg)
        $imgPath = public_path("images/{$this->view}/{$filename}");
        if (is_file($imgPath)) {
            @unlink($imgPath);
            return;
        }

        // Caso: se subió PNG pero se guardó como JPG
        $jpgName = pathinfo($filename, PATHINFO_FILENAME) . '.jpg';
        $jpgPath = public_path("images/{$this->view}/{$jpgName}");
        if (is_file($jpgPath)) {
            @unlink($jpgPath);
        }
    }

    protected function redirectAfterAction(string $action, ?string $backto = null)
    {
        $message = match ($action) {
            'create' => 'Registro creado exitosamente.',
            'update' => 'Registro actualizado exitosamente.',
            'delete' => 'Registro eliminado exitosamente.',
            default  => 'Acción realizada exitosamente.',
        };

        if (str_starts_with($this->view, 'historia_clinica_')) {
            return back()->with('success', $message);
        }

        if ($backto && is_string($backto)) {
            return redirect($backto)->with('success', $message);
        }

        return redirect()->route("{$this->view}.index")->with('success', $message);
    }
}