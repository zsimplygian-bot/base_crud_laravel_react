<?php
namespace App\Helpers;
use Illuminate\Http\Request;
use Carbon\Carbon;
class ListadoQueryBuilder
{
    public static function apply($query, $alias, Request $req, $instance, $viewName)
    {
        $col = $req->input('column');
        if ($col === 'id') {
            $col = 'id_' . $viewName;
        }
        $tipoParaQuery = $req->input('view');
        $meta = ListadoHelper::extractSelectMeta(
            $instance::getQuery($req->input('search'), $tipoParaQuery)['query']
        );
        $colMap = $meta['columnToTable'] ?? [];
        $derived = $meta['derived'] ?? [];
        if ($req->filled('search') && $col) {
            $value = '%' . $req->input('search') . '%';
            if (in_array($col, $derived)) {
                $query->having($col, 'like', $value);
            } elseif (isset($colMap[$col])) {
                $query->where("{$colMap[$col]}.$col", 'like', $value);
            } else {
                $query->where("$alias.$col", 'like', $value);
            }
        }
        if ($req->filled('from') && $req->filled('to')) {
            $query->whereBetween("$alias.created_at", [
                Carbon::parse($req->input('from'))->startOfDay(),
                Carbon::parse($req->input('to'))->endOfDay()
            ]);
        }
        $reserved = ['page', 'limit', 'view', 'sortOrder', 'sortBy', 'column', 'search', 'from', 'to'];
        $allowed = property_exists($instance, 'allowedFilters') ? $instance::$allowedFilters : [];
        foreach ($req->all() as $param => $value) {
            if (!in_array($param, $reserved) && in_array($param, $allowed) && $value !== null && $value !== '') {
                $tableAlias = $colMap[$param] ?? $alias;
                $query->where("$tableAlias.$param", $value);
            }
        }
        $sort = $req->input('sortBy', $req->input('column', 'id'));
if ($sort === 'id') {
    $sort = 'id_' . $viewName;
}
        $sortAlias = $colMap[$sort] ?? $alias;
        $order = $req->input('sortOrder', 'desc');
        $query->orderBy("$sortAlias.$sort", $order);
        return $query;
    }
}