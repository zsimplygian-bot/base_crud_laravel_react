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
        if ($request->boolean($field.'_remove', false)) {
            $this->deleteFile($model, $entity, $field);
            return;
        }

        if (!$request->hasFile($field)) return;

        $file = $request->file($field);
        if (!$file || !$file->isValid()) return;

        $ext = strtolower($file->getClientOriginalExtension());
        $type = $this->allowed[$ext] ?? null;
        if (!$type) throw new \Exception('Tipo de archivo no permitido');

        $disk = Storage::disk('public');
        $basePath = "{$entity}/{$model->getKey()}";
        $tempPath = "{$basePath}_swap";

        $disk->deleteDirectory($tempPath);
        $disk->makeDirectory($tempPath);

        if ($disk->exists($basePath)) {
            foreach ($disk->allFiles($basePath) as $filePath) {
                $disk->copy($filePath, str_replace($basePath, $tempPath, $filePath));
            }
        }

        $timestamp = time(); // Marca de tiempo simple
        if ($type === 'image') {
            $filename = "image_{$timestamp}.jpg";
            $previewName = "image-prev_{$timestamp}.jpg";

            $this->saveImage($file, "{$tempPath}/{$filename}", $disk); // Imagen normal 720px / 50%
            $this->savePreview($file, "{$tempPath}/{$previewName}", $disk); // Preview 50px
        } else {
            $filename = 'document.pdf';
            $disk->putFileAs($tempPath, $file, $filename);
        }

        $disk->deleteDirectory($basePath);
        $disk->move($tempPath, $basePath);

        $model->{$field} = "{$basePath}/{$filename}"; // Guardamos ruta completa
        $model->save();
    }

    protected function deleteFile($model, string $entity, string $field): void
    {
        $disk = Storage::disk('public');
        $basePath = "{$entity}/{$model->getKey()}";

        if ($disk->exists($basePath)) $disk->deleteDirectory($basePath);

        $model->{$field} = null;
        $model->save();
    }

    protected function saveImage($file, string $path, $disk): void
    {
        $image = Image::read($file);
        if ($image->width() >= $image->height()) {
            if ($image->width() > 720) $image->scale(width: 720);
        } else {
            if ($image->height() > 720) $image->scale(height: 720);
        }
        $disk->put($path, (string) $image->toJpeg(50)); // Calidad reducida 50%
        $image = null;
        gc_collect_cycles();
    }

    protected function savePreview($file, string $path, $disk): void
    {
        $image = Image::read($file);
        if ($image->width() >= $image->height())
            $image->scale(width: 50);
        else
            $image->scale(height: 50);
        $disk->put($path, (string) $image->toJpeg(50)); // Preview ultra liviano
        $image = null;
        gc_collect_cycles();
    }
}
