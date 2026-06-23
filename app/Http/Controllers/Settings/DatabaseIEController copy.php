<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DatabaseIEController extends Controller
{
    private $mysqlPath = 'C:\xampp\mysql\bin\mysql.exe';
    private $mysqldumpPath = 'C:\xampp\mysql\bin\mysqldump.exe';

    public function export()
    {
        set_time_limit(0);
        $filename = 'backup-' . now()->format('Y-m-d_H-i-s') . '.sql';
        $path = storage_path("app/{$filename}");

        $dbUser = escapeshellarg(config('database.connections.mysql.username'));
        $dbPass = config('database.connections.mysql.password');
        $dbHost = escapeshellarg(config('database.connections.mysql.host'));
        $dbName = escapeshellarg(config('database.connections.mysql.database'));
        $passFlag = $dbPass ? "-p" . escapeshellarg($dbPass) : "";
        
        $command = "\"{$this->mysqldumpPath}\" -u{$dbUser} {$passFlag} -h{$dbHost} {$dbName} > \"{$path}\" 2>&1";

        exec($command, $output, $returnCode);

        if ($returnCode !== 0) {
            Log::error("Error export DB: " . implode("\n", $output));
            return response()->json(['message' => 'Error al generar backup'], 500);
        }

        return response()->download($path, $filename, [
            'Content-Type' => 'application/octet-stream',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ])->deleteFileAfterSend(true);
    }

    public function import(Request $request)
    {
        set_time_limit(0);
        $request->validate(['backup' => 'required|file']);
        
        $path = $request->file('backup')->getRealPath();
        
        $dbUser = escapeshellarg(config('database.connections.mysql.username'));
        $dbPass = config('database.connections.mysql.password');
        $dbHost = escapeshellarg(config('database.connections.mysql.host'));
        $dbName = escapeshellarg(config('database.connections.mysql.database'));
        $passFlag = $dbPass ? "-p" . escapeshellarg($dbPass) : "";

        $command = "\"{$this->mysqlPath}\" -u{$dbUser} {$passFlag} -h{$dbHost} {$dbName} < \"{$path}\" 2>&1";
        
        exec($command, $output, $returnCode);

        if ($returnCode !== 0) {
            Log::error("Error import DB: " . implode("\n", $output));
            return response()->json(['success' => false, 'message' => 'Error en la importación'], 500);
        }

        return response()->json(['success' => true]);
    }
}