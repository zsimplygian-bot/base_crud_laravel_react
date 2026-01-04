<?php
namespace App\Services;
use Illuminate\Http\Request;
use Intervention\Image\Laravel\Facades\Image;
class FileService
{
    protected array $allowed = [ // extensiones permitidas
        'pdf'  => 'pdf',
        'jpg'  => 'image',
        'jpeg' => 'image',
        'png'  => 'image',
        'webp' => 'image',
        'gif'  => 'image',
    ];
    public function handleUpload(Request $request, $model, string $view, string $field = 'archivo'): void
    {
        $file = $request->file($field); // Archivo recibido
        if (!$file || !$file->isValid()) { return; } // Sin archivo o inválido
        $extension = strtolower($file->getClientOriginalExtension()); // Extensión real
        $type = $this->allowed[$extension] ?? null; // Validar tipo permitido
        if (!$type) { throw new \Exception("Tipo de archivo no permitido: {$extension}"); } // Bloqueo de extensiones
        if ($model->{$field}) { $this->deleteFile($view, $model->{$field}); } // Eliminar archivo anterior
        $filename = $type === 'pdf'
            ? $this->processPdf($file, $model, $view)   // PDF
            : $this->processImage($file, $model, $view); // Imagen
        $model->{$field} = $filename; // Guardar nombre final
        $model->save(); // Persistencia en DB
    }
    protected function processPdf($file, $model, string $view): string
    {
        $filename = "{$model->getKey()}.pdf"; // Renombrado uniforme
        $path = $this->ensurePath("pdf/{$view}"); // Directorio pdf
        $file->move($path, $filename); // Mover PDF tal cual
        return $filename;
    }
    protected function processImage($file, $model, string $view): string
    {
        $filename = "{$model->getKey()}.jpg"; // Conversión obligatoria a JPG
        $path = $this->ensurePath("images/{$view}"); // Ruta imágenes
        $image = Image::read($file); // Leer la imagen
        if ($image->width() > 1024) { $image->scale(width: 1024); } // Redimensionar si es muy grande
        $image->toJpeg(90)->save("{$path}/{$filename}"); // Exportar a JPG optimizado
        return $filename;
    }
    protected function ensurePath(string $relative): string
    {
        $path = public_path($relative); // Ruta final absoluta
        if (!is_dir($path)) { mkdir($path, 0755, true); } // Crear carpetas si no existen
        return $path;
    }
    public function deleteFile(string $view, string $filename): void
    {
        $paths = [
            public_path("pdf/{$view}/{$filename}"),   // Posible PDF
            public_path("images/{$view}/{$filename}"), // Posible imagen original
        ];
        foreach ($paths as $p) {
            if (is_file($p)) { @unlink($p); return; } // Eliminar archivo directo
        }
        $name = pathinfo($filename, PATHINFO_FILENAME); // Nombre base
        $jpg = public_path("images/{$view}/{$name}.jpg"); // Variante jpg

        if (is_file($jpg)) { @unlink($jpg); } // Eliminar .jpg generado
    }
}