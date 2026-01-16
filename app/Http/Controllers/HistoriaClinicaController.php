<?php
namespace App\Http\Controllers;

use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\HistoriaClinica;
use App\Models\HistoriaClinicaSeguimiento;
use App\Models\HistoriaClinicaProcedimiento;
use App\Models\HistoriaClinicaMedicamento;
use App\Models\HistoriaClinicaAnamnesis;
use Illuminate\Http\Request;
class HistoriaClinicaController extends BaseController
{
    public function __construct()
    {
        $this->model = HistoriaClinica::class;
        $this->view = 'historia_clinica';
        parent::__construct();
    }
    public function deleteExtra($model)
    {
        $idHistoria = $model->getKey();
        HistoriaClinicaSeguimiento::where('id_historia_clinica', $idHistoria)->delete();
        HistoriaClinicaAnamnesis::where('id_historia_clinica', $idHistoria)->delete();
        HistoriaClinicaProcedimiento::where('id_historia_clinica', $idHistoria)->delete();
        HistoriaClinicaMedicamento::where('id_historia_clinica', $idHistoria)->delete();
    }

    public function records(int $id)
    {
        return response()->json([
            'data' => HistoriaClinica::getRelatedRecords($id),
        ]);
    }

    public function generatePDF($id)
    {
        $historia_clinica = HistoriaClinica::with([
            'mascota.cliente',
            'historia_seguimientos',
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
        return compact('historia_clinica');
    }
}