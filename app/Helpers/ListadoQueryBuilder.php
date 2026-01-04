<?php
namespace App\Helpers;

use Illuminate\Http\Request;
use Carbon\Carbon;

class ListadoQueryBuilder
{
    public static function apply($query, $alias, Request $req, $instance, $viewName)
    {
        $meta = ListadoHelper::extractSelectMeta(
            $instance::getQuery(null, $viewName)['query']
        );

        $colMap  = $meta['columnToTable'] ?? [];
        $allowed = property_exists($instance, 'allowedFilters')
            ? $instance::$allowedFilters
            : [];

        foreach ((array) $req->input('filters', []) as $field => $value) {
    if ($value === '' || $value === null) continue;

    // Filtro por ID (alias → columna real)
    if ($field === 'id') {
        $query->where("{$alias}.id_{$alias}", $value);
        continue;
    }

    // Campos reales del alias principal
    $query->where("{$alias}.{$field}", $value);
}


        if ($req->filled('from') && $req->filled('to')) {
            $query->whereBetween("$alias.created_at", [
                Carbon::parse($req->from)->startOfDay(),
                Carbon::parse($req->to)->endOfDay()
            ]);
        }

        $sort = $req->input('sortBy', 'id');
        if ($sort === 'id') $sort = "id_$viewName";
        $table = $colMap[$sort] ?? $alias;

        $query->orderBy(
            "$table.$sort",
            $req->input('sortOrder', 'desc')
        );

        return $query;
    }
}
