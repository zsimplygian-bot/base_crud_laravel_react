<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

abstract class BaseSeguimientoController extends Controller
{
    protected string $parentModel;
    protected string $seguimientoModel;
    protected string $view;
    protected string $title;
    protected $listaController;

    public function __construct()
    {
        $this->listaController = app(ListaController::class);
    }

    protected function getModalFields(): array
    {
        if (!method_exists($this->seguimientoModel, 'getModalFields')) {
            return [];
        }

        $fields = $this->seguimientoModel::getModalFields($this->listaController);
        if (!is_array($fields)) return [];

        if (array_is_list($fields) && count($fields) > 0 && is_array($fields[0])) {
            return $fields;
        }

        $normalized = [];
        foreach ($fields as $key => $value) {
            if (is_array($value)) {
                $normalized[] = $value;
            } else {
                $normalized[] = [
                    $key,
                    strtoupper(str_replace('_', ' ', $key)),
                    is_string($value) ? $value : ''
                ];
            }
        }

        return $normalized;
    }

    protected function storeRules(): array { return []; }
    protected function updateRules(): array { return []; }

    public function index($parentId)
    {
        return $this->seguimientoModel::where($this->getParentForeignKey(), $parentId)
            ->orderBy('fecha', 'desc')
            ->get();
    }

    public function handleAction(string $action, ?int $parentId = null)
    {
        $parent = $parentId ? $this->parentModel::findOrFail($parentId) : null;

        $seguimientos = $parent
            ? $this->seguimientoModel::where($this->getParentForeignKey(), $parent->id)
                ->orderBy('fecha', 'desc')
                ->get()
            : collect();

        return Inertia::render("{$this->view}/form", [
            'form_data'    => $parent ? $parent->toArray() : [],
            'modalFields'  => $this->getModalFields(),
            'seguimientos' => $seguimientos->toArray(),
            'action'       => $action,
            'custom_title' => $this->title,
            'title'        => $action === 'create'
                ? "Nuevo {$this->title}"
                : "Editar {$this->title}",
            'view'         => $this->view,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate($this->storeRules());

        $data = $request->input('data', $request->all());
        if (isset($data['data'])) {
            $data = $data['data'];
        }

        $data['creater_id'] = auth()?->id();

        $this->seguimientoModel::create($data);

        return back()->with('success', "{$this->title} registrado correctamente.");
    }

    public function update(Request $request, int $id)
    {
        $request->validate($this->updateRules());

        $modelClass = $this->seguimientoModel;
        $modelInstance = new $modelClass();

        $primaryKey = $modelInstance->getKeyName();

        $data = $request->input('data', $request->all());
        if (isset($data['data'])) {
            $data = $data['data'];
        }

        $registro = $modelClass::where($primaryKey, $id)->firstOrFail();
        $registro->update($data);

        return back()->with('success', "{$this->title} actualizado correctamente.");
    }

    public function destroy(int $id)
    {
        $modelClass = $this->seguimientoModel;
        $modelInstance = new $modelClass();
        $primaryKey = $modelInstance->getKeyName();

        $registro = $modelClass::where($primaryKey, $id)->first();

        if (!$registro) {
            abort(404, "{$this->title} no encontrado.");
        }

        $registro->delete();

        return back()->with('success', "{$this->title} eliminado correctamente.");
    }

    protected function getParentForeignKey(): string
    {
        return property_exists($this->seguimientoModel, 'parentForeignKey')
            ? (new $this->seguimientoModel())->parentForeignKey
            : 'id_historia_clinica';
    }
}
