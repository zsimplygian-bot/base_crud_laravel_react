<?php
namespace App\Http\Controllers;
use App\Models\HistoriaProducto;
class HistoriaProductoController extends BaseController {
    public function __construct() {
        $this->model = HistoriaProducto::class;
        parent::__construct();
    }
    public function records(int $id) {
        return response()->json([
            'data' => HistoriaProducto::getAllRelatedRecords($id),
        ]);
    }
}
