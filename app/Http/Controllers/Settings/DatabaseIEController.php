<?php
namespace App\Http\Controllers\Settings;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
class DatabaseIEController extends Controller
{
    public function __construct()
    {
        // Fuerza la zona horaria correcta
        date_default_timezone_set('America/Lima');
    }
    public function export()
    {
        $filename = 'backup-veterinaria-' . now()->format('Y-m-d_H-i-s') . '.sql';
        $path = storage_path("app/{$filename}");
        $tables = DB::select('SHOW TABLES');
        $key = 'Tables_in_veterinaria';
        $dump = "SET FOREIGN_KEY_CHECKS=0;\n";
        $dump .= "SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';\n";
        $dump .= "START TRANSACTION;\n";
        $dump .= "SET time_zone = '-05:00';\n\n";
        foreach ($tables as $t) {
            $table = $t->$key;
            $create = DB::selectOne("SHOW CREATE TABLE `$table`")->{'Create Table'};
            $dump .= "\n\nDROP TABLE IF EXISTS `$table`;\n$create;\n\n";
            $rows = DB::table($table)->get();
            foreach ($rows as $row) {
                $values = array_map(function ($value) {
                    return isset($value)
                        ? "'" . str_replace("'", "''", $value) . "'"
                        : "NULL";
                }, (array) $row);
                $dump .= "INSERT INTO `$table` VALUES(" . implode(",", $values) . ");\n";
            }
        }
        $dump .= "\nSET FOREIGN_KEY_CHECKS=1;\nCOMMIT;\n";
        file_put_contents($path, $dump);
        DB::table('database_history')->insert([
            'action'     => 'export',
            'filename'   => $filename,
            'user_id'    => Auth::id(),
            'ip_address' => request()->ip(),
            'created_at' => now(), // ahora Lima
        ]);
        return response()->download($path)->deleteFileAfterSend(true);
    }
    public function import(Request $request)
    {
        $request->validate([
            'backup' => 'required|file|mimes:sql,txt'
        ]);
        $file = $request->file('backup');
        $sql = file_get_contents($file->getRealPath());
        DB::unprepared($sql);
        DB::table('database_history')->insert([
            'action'     => 'import',
            'filename'   => $file->getClientOriginalName(),
            'user_id'    => Auth::id(),
            'ip_address' => request()->ip(),
            'created_at' => now(), // ahora Lima
        ]);
        return back()->with('success', 'La base de datos fue importada correctamente.');
    }
}