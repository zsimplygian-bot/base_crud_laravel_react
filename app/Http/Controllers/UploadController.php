<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
class UploadController extends Controller
{
    public function uploadFile(Request $request)
    {
        try {
            // Validamos si hay un archivo válido
            if ($request->hasFile('imagen') && $request->file('imagen')->isValid()) {
                $file = $request->file('imagen');
                // Obtenemos la "view" desde el request
                $view = $request->input('view', 'default');
                $safeView = preg_replace('/[^a-zA-Z0-9_\-]/', '', $view); // Seguridad
                // Creamos nombre y ruta
                $filename = time() . '_' . $file->getClientOriginalName();
                $destination = public_path("images/$safeView");
                // Nos aseguramos de que exista el directorio
                if (!file_exists($destination)) {
                    mkdir($destination, 0755, true);
                }
                $file->move($destination, $filename);
                return response()->json([
                    'filename' => $filename,
                    'url' => asset("images/$safeView/$filename"),
                ]);
            }
            return response()->json(['error' => 'No se recibió archivo válido'], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
