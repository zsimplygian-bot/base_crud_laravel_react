<?php

namespace App\Services;

use Illuminate\Http\Request;
use Intervention\Image\Laravel\Facades\Image;

class FileService
{
    protected array $allowed = [
        'jpg'  => 'image',
        'jpeg' => 'image',
        'png'  => 'image',
        'webp' => 'image',
        'gif'  => 'image',
        'pdf'  => 'document',
    ];

    public function handleUpload(
        Request $request,
        $model,
        string $view,
        string $field = 'archivo'
    ): void {
        $file = $request->file($field);
        if (!$file || !$file->isValid()) { return; }

        $ext  = strtolower($file->getClientOriginalExtension());
        $type = $this->allowed[$ext] ?? null;
        if (!$type) { throw new \Exception('Tipo de archivo no permitido'); }

        $id = $model->getKey();

        $basePath = public_path("media/{$view}");
        $finalDir = "{$basePath}/{$id}";
        $tempDir  = "{$basePath}/{$id}_swap";

        if (is_dir($tempDir)) { $this->deleteDir($tempDir); }
        mkdir($tempDir, 0777, true);

        if (is_dir($finalDir)) {
            $this->copyDir($finalDir, $tempDir); // Mantener otros archivos
        }

        $filename = match ($type) {
            'image'    => 'image.jpg',
            'document' => 'document.pdf',
        };

        if ($type === 'image') {
            $this->saveImage($file, "{$tempDir}/{$filename}");
        } else {
            $file->move($tempDir, $filename);
        }

        $this->deleteDir($finalDir); // Limpio y total
        rename($tempDir, $finalDir); // Swap completo

        $model->{$field} = $filename;
        $model->save();
    }

    protected function saveImage($file, string $path): void
    {
        $image = Image::read($file);

        if ($image->width() > 1024) {
            $image->scale(width: 1024);
        }

        $image->toJpeg(90)->save($path);

        $image = null;
        gc_collect_cycles();
    }

    protected function deleteDir(string $dir): void
    {
        if (!is_dir($dir)) { return; }

        foreach (scandir($dir) as $item) {
            if ($item === '.' || $item === '..') { continue; }
            $path = "{$dir}/{$item}";
            is_dir($path) ? $this->deleteDir($path) : @unlink($path);
        }

        @rmdir($dir);
    }

    protected function copyDir(string $src, string $dst): void
    {
        foreach (scandir($src) as $item) {
            if ($item === '.' || $item === '..') { continue; }
            $from = "{$src}/{$item}";
            $to   = "{$dst}/{$item}";
            is_dir($from) ? $this->copyDir($from, $to) : copy($from, $to);
        }
    }
}
