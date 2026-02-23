<?php
namespace App\Http\Controllers;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Historia;
use App\Models\HistoriaSeguimiento;
use App\Models\HistoriaProcedimiento;
use App\Models\HistoriaProducto;
use App\Models\HistoriaAnamnesis;
use Illuminate\Http\Request;
class HistoriaController extends BaseController
{
    public function __construct()
    {
        $this->model = Historia::class;
        $this->view = 'historia_';
        parent::__construct();
    }
    public function deleteExtra($model)
    {
        $idHistoria = $model->getKey();
        HistoriaSeguimiento::where('id_historia_', $idHistoria)->delete();
        HistoriaAnamnesis::where('id_historia_', $idHistoria)->delete();
        HistoriaProcedimiento::where('id_historia_', $idHistoria)->delete();
        HistoriaProducto::where('id_historia_', $idHistoria)->delete();
    }
    public function records(int $id)
    {
        return response()->json([
            'data' => Historia::getAllRelatedRecords($id),
        ]);
    }
    public function generatePDF($id)
    {
        $historia = Historia::with([
            'mascota.cliente',
            'historia_seguimientos',
            'historia_procedimientos',
            'historia_productos',
            'historia_anamnesis'
        ])->findOrFail($id);
        $data = $this->preparePDFData($historia);
        $pdf = Pdf::loadView('pdf.historia', $data)
            ->setPaper('a4', 'portrait');
        return $pdf->stream('historia'.$id.'.pdf');
    }
    private function preparePDFData($historia)
    {
        return compact('historia');
    }
}