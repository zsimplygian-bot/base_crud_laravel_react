<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

abstract class BaseSeguimientoController extends Controller
{
    /**
     * Modelo padre (ej: HistoriaClinica)
     */
    protected string $parentModel;

    /**
     * Modelo seguimiento (ej: HistoriaClinicaSeguimiento)
     */
    protected string $seguimientoModel;

    /**
     * Nombre de la vista principal (para Inertia)
     */
    protected string $view;

    /**
     * Título de la sección
     */
    protected string $title;

    /**
     * Retorna los campos del modal para crear/editar seguimiento
     */
    protected function getModalFields(): array
    {
        return $this->seguimientoModel::getModalFields();
    }

    /**
     * Reglas de validación al crear un seguimiento
     */
    protected function storeRules(): array
    {
        return [];
    }

    /**
     * Reglas de validación al actualizar un seguimiento
     */
    protected function updateRules(): array
    {
        return [];
    }

    /**
     * Obtener todos los seguimientos del registro padre
     */
    public function index($parentId)
    {
        return $this->seguimientoModel::where($this->getParentForeignKey(), $parentId)
            ->orderBy('fecha', 'desc')
            ->get();
    }

    /**
     * Mostrar el formulario de acción (create/edit) con modalFields y seguimientos
     */
    public function handleAction($action, $parentId = null)
    {
        $parent = $parentId ? $this->parentModel::findOrFail($parentId) : null;

        $seguimientos = $parent
            ? $this->seguimientoModel::where($this->getParentForeignKey(), $parent->id)
                ->orderBy('fecha', 'desc')
                ->get()
            : [];

        return Inertia::render("{$this->view}/form", [
            'form_data'    => $parent,
            'modalFields'  => $this->getModalFields(),
            'seguimientos' => $seguimientos,
            'action'       => $action,
            'custom_title' => $this->title,
            'title'        => $action === 'create' ? "Nuevo {$this->title}" : "Editar {$this->title}",
            'view'         => $this->view,
        ]);
    }

    /**
     * Guardar nuevo seguimiento
     */
    public function store(Request $request)
    {
        $request->validate($this->storeRules());

        $data = $request->all();
        $data['creater_id'] = auth()->id();

        $this->seguimientoModel::create($data);

        return back()->with('success', "{$this->title} registrado correctamente.");
    }

    /**
     * Actualizar seguimiento
     */
    public function update(Request $request, $id)
    {
        $request->validate($this->updateRules());

        $seguimiento = $this->seguimientoModel::findOrFail($id);
        $seguimiento->update($request->all());

        return back()->with('success', "{$this->title} actualizado correctamente.");
    }

    /**
     * Eliminar seguimiento
     */
    public function destroy($id)
    {
        $seguimiento = $this->seguimientoModel::findOrFail($id);
        $seguimiento->delete();

        return back()->with('success', "{$this->title} eliminado correctamente.");
    }

    /**
     * Nombre del campo FK hacia el padre
     */
    protected function getParentForeignKey(): string
    {
        // Por convención: id_{nombre_tabla_padre}
        return 'id_' . strtolower((new $this->parentModel)->getTable());
    }
}
