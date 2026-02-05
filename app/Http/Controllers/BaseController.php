<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use App\Services\FileService;
abstract class BaseController extends Controller
{
    protected string $view;
    protected string $model;
    protected FileService $files;
    public function __construct()
    {
        $this->files = app(FileService::class);
        if (!empty($this->model)) {
            $this->view = (new $this->model)->getTable();
        }
    }
    public function index()
    {
        return Inertia::render("{$this->view}/index", [
            'success' => session('success'),
        ]);
    }
    public function store(Request $request) { return $this->persist($request); }
    public function update(Request $request, $id) { return $this->persist($request, $id); }
    public function show($id): JsonResponse
    {
        $record = $this->model::findOrFail($id);
        return response()->json($record);
    }
    public function destroy($id)
    {
        $model = $this->model::findOrFail($id);
        if (method_exists($this, 'deleteExtra')) {
            $this->deleteExtra($model);
        }
        if (!empty($model->archivo)) {
            $this->files->deleteFile($this->view, $model->archivo);
        }
        $model->delete();
        return redirect()->back()->with('success', 'Registro eliminado exitosamente.');
    }
    protected function persist(Request $request, $id = null)
{
    $data = $this->validateData($request);
    if (method_exists($this, 'validateExtra')) {
        $this->validateExtra($request, $id);
    }
    $model = $id ? $this->model::findOrFail($id) : new $this->model;
    $model->fill($data);
    $model->{$id ? 'updater_id' : 'creater_id'} = auth()?->id();
    $model->save();

    // ⚡ Llamar siempre a handleUpload para que pueda borrar si archivo_remove=true
    $this->files->handleUpload($request, $model, $this->view, 'archivo');

    return redirect()->back()->with(
        'success',
        $id ? 'Registro actualizado exitosamente.' : 'Registro creado exitosamente.'
    );
}

    protected function validateData(Request $request): array
    {
        $input = $request->input('data', $request->all());
        return \Validator::make(
            $input,
            $this->model::getValidationRules()
        )->validate();
    }
}