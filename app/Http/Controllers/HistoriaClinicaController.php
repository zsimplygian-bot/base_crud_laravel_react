<?php
namespace App\Http\Controllers;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\HistoriaClinica;
use App\Models\HistoriaClinicaSeguimiento;
use App\Models\HistoriaClinicaProcedimiento;
use App\Models\HistoriaClinicaMedicamento;
use App\Models\HistoriaClinicaAnamnesis;

class HistoriaClinicaController extends BaseController
{
    public function __construct()
    {
        $this->model = HistoriaClinica::class;
        parent::__construct();
    }

    protected function extraFormData($record, string $action): array
{
    return [
        // ⚡️ Generar los campos modales igual que formFields
        'modalFields' => HistoriaClinicaSeguimiento::getModalFields($this->listaController, $record, $action),
        'procedimientoFields' => HistoriaClinicaProcedimiento::getModalFields($this->listaController, $record, $action),
        'medicamentoFields'   => HistoriaClinicaMedicamento::getModalFields($this->listaController, $record, $action),
        'anamnesisFields'     => HistoriaClinicaAnamnesis::getModalFields($this->listaController, $record, $action),

        // Datos relacionados
        'seguimientos'  => $record ? $record->historia_seguimientos()->orderBy('created_at', 'asc')->get() : collect(),
        'procedimientos'=> $record ? $record->historia_procedimientos()->orderBy('created_at', 'asc')->get() : collect(),
        'medicamentos'  => $record ? $record->historia_medicamentos()->orderBy('created_at', 'asc')->get() : collect(),
        'anamnesis'     => $record ? $record->historia_anamnesis()->orderBy('created_at', 'asc')->get() : collect(),
    ];
}


    public function generatePDF($id)
{
    // Cargamos historia clínica con relaciones necesarias
    $historia_clinica = HistoriaClinica::with([
        'mascota.cliente',       // Mascota y su cliente
        'historia_seguimientos', // Seguimientos
        'historia_procedimientos',
        'historia_medicamentos',
        'historia_anamnesis'
    ])->findOrFail($id);

    $data = $this->preparePDFData($historia_clinica);

    $pdf = Pdf::loadView('pdf.historia_clinica', $data)
        ->setPaper('a4', 'portrait');

    return $pdf->stream('historia_clinica_'.$id.'.pdf');
}

private function preparePDFData($historia_clinica)
{
    // Aquí ya tienes la relación cargada
    return compact('historia_clinica');
}

}
