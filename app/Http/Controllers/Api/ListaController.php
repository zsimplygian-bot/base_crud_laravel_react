<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
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
    // Obtener lista completa (para selects)
    public function obtenerLista(Request $request): JsonResponse
    {
        $campo = $request->query('campo');
        $param = $request->query('param');
        if (!$campo) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'El parámetro "campo" es obligatorio.',
            ], 400);
        }
        $resultado = $this->listaModel->getListaDinamica($campo, $param);
        return $this->respuestaJson($resultado);
    }
    // Obtener un item por ID (para editar / mostrar)
    public function obtenerItem(Request $request): JsonResponse
    {
        $tabla = $request->query('tabla');
        $id    = $request->query('id');
        if (!$tabla || !$id) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Parámetros "tabla" e "id" son obligatorios.',
            ], 400);
        }
        $resultado = $this->listaModel->getItemById($tabla, (int)$id);
        return $this->respuestaJson($resultado);
    }
    /**
     * Método compatible con la ruta que agregaste: /listas/item
     *
     * Acepta query params:
     *  - tabla OR campo (campo puede venir como 'id_cliente' o 'cliente')
     *  - id
     *
     * Ejemplos:
     *  /api/listas/item?tabla=cliente&id=5
     *  /api/listas/item?campo=id_cliente&id=5
     */
    public function getItemInicial(Request $request): JsonResponse
    {
        $tablaOrCampo = $request->query('tabla') ?? $request->query('campo');
        $id = $request->query('id');
        if (!$tablaOrCampo || !$id) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Parámetros "tabla" (o "campo") e "id" son obligatorios.',
            ], 400);
        }
        // Normalizar: si viene 'id_tabla' -> quitar prefijo id_
        $tabla = preg_match('/^id_/', $tablaOrCampo) ? substr($tablaOrCampo, 3) : $tablaOrCampo;
        $resultado = $this->listaModel->getItemById($tabla, (int)$id);
        return $this->respuestaJson($resultado);
    }
    // Respuesta estándar JSON
    protected function respuestaJson(array $resultado): JsonResponse
    {
        return response()->json([
            'success' => $resultado['success'],
            'data'    => $resultado['data'] ?? null,
            'message' => $resultado['message'] ?? null,
        ], $resultado['success'] ? 200 : 400);
    }
}