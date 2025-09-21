<?php
namespace App\Helpers;
use Illuminate\Database\Query\Expression;
use Illuminate\Support\Facades\DB;
class ListadoHelper
{
    public static function extractSelectMeta($query)
    {
        // Si $query es un Eloquent\Builder, obtener el Query\Builder
        if (method_exists($query, 'getQuery')) {
            $query = $query->getQuery();
        }
        $columns = $query->columns ?? [];
        if (empty($columns)) {
            $sql = $query->toSql();
            preg_match('/select\s+(.*?)\s+from/i', $sql, $m);
            $columns = array_map('trim', explode(',', $m[1] ?? ''));
        }
        $aliases = [];
        $derived = [];
        $colToTable = [];
        foreach ($columns as $col) {
            $colStr = $col instanceof Expression
                ? $col->getValue(DB::connection()->getQueryGrammar())
                : $col;
            if (preg_match('/\s+as\s+[`"]?([\w]+)[`"]?$/i', $colStr, $mAs)) {
                $alias = $mAs[1];
                $aliases[] = $alias;
                if (preg_match('/\b(case\b|concat\(|if\(|sum\(|count\(|avg\(|max\(|min\()/i', strtolower($colStr))) {
                    $derived[] = $alias;
                }
                if (preg_match('/([a-z_]+)\.([a-z_]+)\s+as\s+[`"]?' . $alias . '`?/i', $colStr, $mTbl)) {
                    $colToTable[$alias] = $mTbl[1];
                } else {
                    $colToTable[$alias] = null;
                }
            } elseif (preg_match('/([a-z_]+)\.([a-z_]+)/i', $colStr, $mPt)) {
                $table = $mPt[1];
                $column = $mPt[2];
                $aliases[] = $column;
                $colToTable[$column] = $table;
            }
        }
        return [
            'aliases'       => $aliases,
            'derived'       => $derived,
            'columnToTable' => $colToTable,
        ];
    }
}