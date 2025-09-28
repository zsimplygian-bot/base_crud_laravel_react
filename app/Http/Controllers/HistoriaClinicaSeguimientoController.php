<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HistoriaClinicaSeguimiento;

class HistoriaClinicaSeguimientoController extends Controller
{
    public function index($id_historia_clinica)
    {
        return HistoriaClinicaSeguimiento::where('id_historia_clinica', $id_historia_clinica)
            ->orderBy('fecha', 'desc')
            ->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_historia_clinica' => 'required|integer|exists:historia_clinica,id_historia_clinica',
            'detalle' => 'required|string',
            'fecha' => 'required|date',
        ]);

        HistoriaClinicaSeguimiento::create([
            'id_historia_clinica' => $request->id_historia_clinica,
            'detalle' => $request->detalle,
            'tratamiento' => $request->tratamiento,
            'observaciones' => $request->observaciones,
            'fecha' => $request->fecha,
            'creater_id' => auth()->id(),
        ]);

        return back()->with('success', 'Seguimiento registrado correctamente.');
    }

    // ⚡ NUEVO MÉTODO UPDATE
    public function update(Request $request, $id)
    {
        $request->validate([
            'detalle' => 'required|string',
            'fecha' => 'required|date',
        ]);

        $seguimiento = HistoriaClinicaSeguimiento::findOrFail($id);
        $seguimiento->detalle = $request->detalle;
        $seguimiento->tratamiento = $request->tratamiento;
        $seguimiento->observaciones = $request->observaciones;
        $seguimiento->fecha = $request->fecha;
        $seguimiento->save();

        return back()->with('success', 'Seguimiento actualizado correctamente.');
    }

    public function destroy($id)
    {
        $seguimiento = HistoriaClinicaSeguimiento::findOrFail($id);
        $seguimiento->delete();

        return back()->with('success', 'Seguimiento eliminado.');
    }
}
