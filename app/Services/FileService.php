<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class FileService
{
    protected array $allowed = [
        'jpg' => 'image', 'jpeg' => 'image', 'png' => 'image',
        'webp' => 'image', 'gif' => 'image', 'pdf' => 'document',
    ];

    public function handleUpload(Request $request, $model, string $entity, string $field = 'archivo'): void
    {
        // ⚡ BORRAR ARCHIVO SI EL FRONTENVIA EL FLAG
        if ($request->boolean($field.'_remove', false)) {
            $this->deleteFile($model, $entity, $field);
            return;
        }

        // ⚡ Si no hay archivo nuevo, no hacer nada más
        if (!$request->hasFile($field)) return;

        $file = $request->file($field);
        if (!$file || !$file->isValid()) return;

        $ext = strtolower($file->getClientOriginalExtension());
        $type = $this->allowed[$ext] ?? null;
        if (!$type) throw new \Exception('Tipo de archivo no permitido');

        $id = $model->getKey();
        $disk = Storage::disk('public');

        $basePath = "{$entity}/{$id}";
        $tempPath = "{$basePath}_swap";

        $disk->deleteDirectory($tempPath);
        $disk->makeDirectory($tempPath);

        if ($disk->exists($basePath)) {
            foreach ($disk->allFiles($basePath) as $filePath) {
                $disk->copy($filePath, str_replace($basePath, $tempPath, $filePath));
            }
        }

        // ⚡ Cambiar nombre de imagen para evitar caching
        $filename = $type === 'image' ? 'image_'.time().'.jpg' : 'document.pdf';

        if ($type === 'image') $this->saveImage($file, "{$tempPath}/{$filename}", $disk);
        else $disk->putFileAs($tempPath, $file, $filename);

        $disk->deleteDirectory($basePath);
        $disk->move($tempPath, $basePath);

        $model->{$field} = "{$basePath}/{$filename}";
        $model->save();
    }

    protected function deleteFile($model, string $entity, string $field): void
    {
        $disk = Storage::disk('public');
        $basePath = "{$entity}/{$model->getKey()}";
        if ($disk->exists($basePath)) {
            $disk->deleteDirectory($basePath);
        }
        $model->{$field} = null;
        $model->save();
    }

    protected function saveImage($file, string $path, $disk): void
    {
        $image = Image::read($file);
        if ($image->width() > 1024) $image->scale(width: 1024);
        $disk->put($path, (string) $image->toJpeg(90));
        $image = null;
        gc_collect_cycles();
    }
}
