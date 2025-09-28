<?php
namespace App\Http\Controllers;

use App\Models\HistoriaClinica;
use App\Models\HistoriaClinicaSeguimiento;
use App\Http\Controllers\BaseController;
use Inertia\Inertia;

class HistoriaClinicaController extends BaseController
{
    public function __construct() {
        $this->model = HistoriaClinica::class;
        parent::__construct();
    }

    public function handleAction($action, $id = null)
{
    $form_data = $id ? HistoriaClinica::find($id) : new HistoriaClinica();
    $seguimientos = $id ? $form_data->seguimientos()->orderBy('fecha', 'desc')->get() : [];

    return Inertia::render("historia_clinica/form", [
        "form_data" => $form_data ?? new HistoriaClinica(), // nunca null
        "formFields" => $this->model::getFormFields($this->listaController, $form_data, $action),
        "action" => $action,
        "custom_title" => "Historia Clínica",
        "view" => "historia_clinica",
        "title" => "Historia Clínica",
        "seguimientos" => $seguimientos,
    ]);
}
}
