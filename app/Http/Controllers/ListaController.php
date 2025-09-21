<?php
namespace App\Http\Controllers;
use App\Models\Lista;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
class ListaController extends Controller
{
    protected Lista $listaModel;
    public function __construct(Lista $listaModel)
    {
        $this->listaModel = $listaModel;
    }
    // Obtiene lista simple por tabla permitida. 
    public function getLista(string $tabla): JsonResponse
    {
        $resultado = $this->listaModel->getLista($tabla);
        return $this->respuestaJson($resultado);
    }
    // Obtiene lista especial o simple según campo.
    public function getListaPorCampo(string $campo): JsonResponse
    {
        $resultado = $this->listaModel->getListaDinamica($campo);
        return $this->respuestaJson($resultado);
    }
    // Método genérico para listas especiales tipo previo, delegados, personas, etc.
    public function getListaEspecial(string $tipo): JsonResponse
    {
        try {
            if (!method_exists($this->listaModel, $tipo)) {
                return response()->json([
                    'success' => false,
                    'message' => "Método {$tipo} no existe en el modelo Lista.",
                    'data' => null,
                ], 404);
            }
            $resultado = $this->listaModel->$tipo();
            return $this->respuestaJson($resultado);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null,
            ], 500);
        }
    }
    // Helper para estandarizar respuestas JSON.
    protected function respuestaJson(array $resultado): JsonResponse
    {
        if ($resultado['success']) {
            return response()->json([
                'success' => true,
                'data' => $resultado['data'],
                'message' => $resultado['message'] ?? null,
            ]);
        }
        return response()->json([
            'success' => false,
            'data' => null,
            'message' => $resultado['message'] ?? 'Error desconocido',
        ], 400);
    }
}