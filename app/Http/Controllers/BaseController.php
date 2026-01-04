<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\JsonResponse;
use App\Services\FileService;
abstract class BaseController extends Controller
{
    protected string $view; // vista
    protected string $model; // modelo
    protected FileService $files; // files
    public function __construct()
    {
        $this->files = app(FileService::class); // servicio archivos
        if (!empty($this->model)) {
            $this->view = (new $this->model)->getTable(); // vista=tabla
        }
    }
    public function index()
    {
        return Inertia::render("{$this->view}/index", [
            'success' => session('success'), // flash
        ]);
    }
    public function store(Request $request) { return $this->persist($request); } // create
    public function update(Request $request, $id) { return $this->persist($request, $id); } // update
    public function show($id): JsonResponse
    {
        $record = $this->model::showById($id); // show modelo
        abort_if(!$record, 404); // no existe
        return response()->json($record); // json
    }
    public function destroy($id)
    {
        $model = $this->model::findOrFail($id); // obtener
        if (method_exists($this, 'deleteExtra')) {
            $this->deleteExtra($model); // extra
        }
        if (!empty($model->archivo)) {
            $this->files->deleteFile($this->view, $model->archivo); // borrar archivo
        }
        $model->delete(); // delete
        return redirect()->back()->with('success', 'Registro eliminado exitosamente.'); // flash
    }
    protected function persist(Request $request, $id = null)
    {
        $data = $this->validateData($request); // validar
        if (method_exists($this, 'validateExtra')) {
            $this->validateExtra($request, $id); // extra
        }
        $model = $id ? $this->model::findOrFail($id) : new $this->model; // instancia
        $model->fill($data); // fill
        $model->{$id ? 'updater_id' : 'creater_id'} = auth()?->id(); // auditoría
        $model->save(); // save
        if ($request->hasFile('archivo')) {
            $this->files->handleUpload($request, $model, $this->view, 'archivo'); // upload
        }
        return redirect()->back()->with(
            'success',
            $id ? 'Registro actualizado exitosamente.' : 'Registro creado exitosamente.'
        );
    }
    protected function validateData(Request $request): array
    {
        $input = $request->input('data', $request->all()); // input
        return \Validator::make(
            $input,
            $this->model::getValidationRules() // rules
        )->validate();
    }
}
