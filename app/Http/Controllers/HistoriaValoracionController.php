<?php
namespace App\Http\Controllers;

use App\Models\HistoriaValoracion;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class HistoriaValoracionController extends BaseController
{
    public function __construct()
    {
        $this->model = HistoriaValoracion::class;
        parent::__construct();
    }

    protected function validateExtra(Request $request, $id = null): void
    {
        $input = $request->input('data', $request->all()); // Soporta payload con data
        $idHistoria = $input['id_historia'] ?? null; // Id de historia a validar

        if (!$idHistoria) return; // Si no viene, no valida aqui

        $query = HistoriaValoracion::where('id_historia', $idHistoria);

        if ($id) {
            $query->where('id', '!=', $id); // Permite update del mismo registro
        }

        if ($query->exists()) {
            throw ValidationException::withMessages([
                'id_historia' => 'Ya existe una valoración registrada para esta historia.'
            ]);
        }
    }
}