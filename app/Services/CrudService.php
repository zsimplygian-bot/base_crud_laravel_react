<?php

namespace App\Services;

use Illuminate\Http\Request;
use App\Http\Controllers\BaseController;

class CrudService
{
    protected FileService $files;

    public function __construct(FileService $files)
    {
        $this->files = $files;
    }

    public function store(BaseController $controller, Request $request)
    {
        return $this->persist($controller, $request);
    }

    public function update(BaseController $controller, Request $request, $id)
    {
        return $this->persist($controller, $request, $id);
    }

    public function destroy(BaseController $controller, $id)
    {
        $model = $controller->model::findOrFail($id);

        if (method_exists($controller, 'deleteExtra')) {
            $controller->deleteExtra($model);
        }

        if ($model->archivo) {
            $this->files->deleteFile($controller->view, $model->archivo);
        }

        $model->delete();

        return $controller->redirectAfterAction('delete', $controller->extractBackto(request()));
    }

    protected function persist(BaseController $controller, Request $request, $id = null)
    {
        $backto = $controller->extractBackto($request);
        $data   = $controller->validateData($request);

        if (method_exists($controller, 'validateExtra')) {
            $controller->validateExtra($request, $id);
        }

        $model = $id ? $controller->model::findOrFail($id) : new $controller->model();
        $model->fill($data);
        $model->{$id ? 'updater_id' : 'creater_id'} = auth()?->id();
        $model->save();

        if ($request->hasFile('archivo')) {
            $this->files->handleUpload($request, $model, $controller->view, 'archivo');
        }

        if ($controller->view === 'historia_clinica' && !$id) {
            return redirect("/{$controller->view}/form/update/{$model->getKey()}")
                ->with('success', 'Registro creado exitosamente.');
        }

        return $controller->redirectAfterAction($id ? 'update' : 'create', $backto);
    }
}
