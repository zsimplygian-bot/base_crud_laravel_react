<?php
namespace App\Helpers;

use Illuminate\Http\Request;
use Carbon\Carbon;

class ListadoQueryBuilder
{
    public static function apply($query, $alias, Request $req, $instance, $viewName)
    {
        // Extraemos la metadata que identifica qué campos son reales y cuáles derivados (MAX, CASE, etc.)
        $meta = ListadoHelper::extractSelectMeta(
            $instance::getQuery(null, $viewName)['query']
        );

        $colMap  = $meta['columnToTable'] ?? [];
        $derived = $meta['derived'] ?? []; // Campos como 'recencia' o 'estado_recencia'

        // --- MANEJO DE FILTROS ---
        foreach ((array) $req->input('filters', []) as $field => $value) {
            if ($value === '' || $value === null) continue;

            if ($field === 'id') {
                $query->where("{$alias}.id_{$alias}", $value);
                continue;
            }

            // Evitamos aplicar WHERE a campos derivados (daría error de columna no encontrada)
            if (!in_array($field, $derived)) {
                $query->where("{$alias}.{$field}", $value);
            }
        }

        // --- FILTRO DE FECHAS ---
        if ($req->filled('from') && $req->filled('to')) {
            $query->whereBetween("$alias.created_at", [
                Carbon::parse($req->from)->startOfDay(),
                Carbon::parse($req->to)->endOfDay()
            ]);
        }

        // --- MANEJO DE ORDENAMIENTO OPTIMIZADO ---
        $sort = $req->input('sortBy', 'id');
        $order = $req->input('sortOrder', 'desc');

        if ($sort === 'id') {
            // Manejo especial para la llave primaria con prefijo
            $query->orderBy("{$alias}.id_{$alias}", $order);
        } elseif (in_array($sort, $derived)) {
            /**
             * SOLUCIÓN: Si el campo es derivado, ordenamos por el ALIAS directamente.
             * SQL permite "ORDER BY recencia", pero fallaría con "ORDER BY cliente.recencia".
             */
            $query->orderBy($sort, $order);
        } else {
            // Para campos físicos, buscamos su tabla de origen en el mapa
            $table = $colMap[$sort] ?? $alias;
            $query->orderBy("$table.$sort", $order);
        }

        return $query;
    }
}