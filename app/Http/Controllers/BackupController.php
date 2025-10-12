<?php
namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
class BackupController extends Controller
{
    public function export()
    {
        $filename = 'backup-veterinaria-' . now()->format('Y-m-d_H-i-s') . '.sql';
        $path = storage_path("app/{$filename}");
        $tables = DB::select('SHOW TABLES');
        $key = 'Tables_in_veterinaria';
        // Encabezado del dump
        $dump = "SET FOREIGN_KEY_CHECKS=0;\n";
        $dump .= "SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';\n";
        $dump .= "START TRANSACTION;\n";
        $dump .= "SET time_zone = '+00:00';\n\n";
        foreach ($tables as $tableObj) {
            $table = $tableObj->$key;
            // Estructura
            $create = DB::selectOne("SHOW CREATE TABLE `$table`")->{'Create Table'};
            $dump .= "\n\nDROP TABLE IF EXISTS `$table`;\n$create;\n\n";
            // Datos
            $rows = DB::table($table)->get();
            foreach ($rows as $row) {
                $values = array_map(function ($value) {
                    return isset($value)
                        ? "'" . str_replace("'", "''", $value) . "'"
                        : 'NULL';
                }, (array) $row);
                $dump .= "INSERT INTO `$table` VALUES(" . implode(',', $values) . ");\n";
            }
        }
        // Pie del dump
        $dump .= "\nSET FOREIGN_KEY_CHECKS=1;\nCOMMIT;\n";
        file_put_contents($path, $dump);
        return response()->download($path)->deleteFileAfterSend(true);
    }
}