<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class FileService
{
    protected array $allowed = [
        'jpg' => 'image',
        'jpeg' => 'image',
        'png' => 'image',
        'webp' => 'image',
        'gif' => 'image',
        'pdf' => 'document',
    ];

    public function handleUpload(
        Request $request,
        $model,
        string $entity,
        string $field = 'archivo'
    ): void {
        $file = $request->file($field);
        if (!$file || !$file->isValid()) { return; } // Archivo inválido

        $ext = strtolower($file->getClientOriginalExtension());
        $type = $this->allowed[$ext] ?? null;
        if (!$type) { throw new \Exception('Tipo de archivo no permitido'); }

        $id = $model->getKey();
        $disk = Storage::disk('public');

        $basePath = "{$entity}/{$id}"; // Ruta lógica por entidad
        $tempPath = "{$basePath}_swap"; // Directorio temporal para swap

        $disk->deleteDirectory($tempPath); // Limpieza previa
        $disk->makeDirectory($tempPath); // Crear directorio temporal

        if ($disk->exists($basePath)) {
            foreach ($disk->allFiles($basePath) as $filePath) {
                $disk->copy(
                    $filePath,
                    str_replace($basePath, $tempPath, $filePath)
                ); // Mantener otros archivos
            }
        }

        $filename = match ($type) {
            'image' => 'image.jpg',
            'document' => 'document.pdf',
        };

        if ($type === 'image') {
            $this->saveImage($file, "{$tempPath}/{$filename}", $disk); // Imagen procesada
        } else {
            $disk->putFileAs($tempPath, $file, $filename); // Documento directo
        }

        $disk->deleteDirectory($basePath); // Borrar versión anterior
        $disk->move($tempPath, $basePath); // Swap final

        $model->{$field} = "{$basePath}/{$filename}"; // Guardar ruta relativa
        $model->save();
    }

    protected function saveImage($file, string $path, $disk): void
    {
        $image = Image::read($file);

        if ($image->width() > 1024) {
            $image->scale(width: 1024); // Redimension seguro
        }

        $disk->put($path, (string) $image->toJpeg(90)); // Guardado optimizado

        $image = null; // Liberar memoria
        gc_collect_cycles();
    }
}
