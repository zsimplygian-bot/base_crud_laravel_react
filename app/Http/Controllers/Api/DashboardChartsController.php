<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class DashboardChartsController extends Controller
{
    public function charts(Request $request)
    {
        $table = $request->query('table');
        $from  = $request->query('from');
        $to    = $request->query('to');
        if (!$table || !$from || !$to) {
            return response()->json([
                'error' => 'Parámetros inválidos'
            ], 422);
        }
        $serie = \DB::table($table)
            ->selectRaw("DATE(created_at) as dia, COUNT(*) as total")
            ->whereBetween('created_at', [$from . " 00:00:00", $to . " 23:59:59"])
            ->groupBy('dia')
            ->orderBy('dia')
            ->get();
        $distribucion = [];
        return response()->json([
            'serie' => $serie,
            'distribucion' => $distribucion
        ]);
    }
}