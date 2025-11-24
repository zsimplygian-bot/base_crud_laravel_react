<?php
namespace App\Models;
use Illuminate\Support\Facades\DB;
class Lista
{
    protected static array $tablasPermitidas = [
        'sexo',
        'medicamento',
        'procedimiento',
        'cliente',
        'mascota',
        'estado_cita',
        'estado_mascota',
        'motivo_cita',
        'motivo_historia_clinica',
        'estado_historia_clinica',
        'especie',
        'unidad_tiempo',
        'raza',
    ];
    protected static array $columnasTablasSimples = [
        // Si alguna tabla tiene columnas personalizadas, defínela aquí.
        // 'especialidad' => ['id_especialidad as id', 'especialidad as label'],
    ];
    protected static array $listasEspeciales = [
        'id_mascota' => 'getListaMascota',
        'id_raza'    => 'getListaRaza',
    ];
    /**
     * Devuelve una lista simple desde una tabla permitida.
     */
    public function getLista(string $tabla): array
    {
        $tabla = strtolower(trim($tabla));
        if (!in_array($tabla, self::$tablasPermitidas, true)) {
            return [
                'success' => false,
                'data'    => null,
                'message' => "Tabla no permitida: {$tabla}",
            ];
        }
        try {
            $select = self::$columnasTablasSimples[$tabla] ?? [
                "id_{$tabla} as id",
                "{$tabla} as label",
            ];
            $data = DB::table($tabla)
                ->select($select)
                ->orderBy('label', 'asc')
                ->get()
                ->toArray();
            return [
                'success' => true,
                'data'    => $data,
                'message' => null,
            ];
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }
    /**
     * Devuelve la lista dinámica (simple o especial).
     */
    public function getListaDinamica(string $clave, $param = null): array
    {
        if (isset(self::$listasEspeciales[$clave]) && method_exists($this, self::$listasEspeciales[$clave])) {
            return $this->{self::$listasEspeciales[$clave]}($param);
        }
        $claveNormalizada = preg_match('/^id_/', $clave) ? substr($clave, 3) : $clave;
        return $this->getLista($claveNormalizada);
    }
    // Obtener un solo item por ID (para editar)
    public function getItemById(string $tablaOrCampo, int $id): array
    {
        // Normalizar: si viene "id_cliente" -> "cliente"
        $tabla = preg_match('/^id_/', $tablaOrCampo)
            ? substr($tablaOrCampo, 3)
            : $tablaOrCampo;
        $tabla = strtolower(trim($tabla));
        // Validar tabla
        if (!in_array($tabla, self::$tablasPermitidas, true)) {
            return [
                'success' => false,
                'data'    => null,
                'message' => "Tabla no permitida: {$tabla}",
            ];
        }
        try {
            // Verificar si es una lista especial
            if (isset(self::$listasEspeciales["id_{$tabla}"])) {
                $method = self::$listasEspeciales["id_{$tabla}"];
                if (method_exists($this, $method)) {
                    // Obtener lista especial COMPLETA
                    $fullList = $this->{$method}();
                    if ($fullList['success'] !== true) {
                        return $fullList;
                    }
                    // Buscar el item dentro de la lista especial
                    $item = collect($fullList['data'])->firstWhere('id', $id);
                    return [
                        'success' => $item !== null,
                        'data'    => $item,
                        'message' => $item ? null : "No encontrado",
                    ];
                }
            }
            // Caso normal (tabla simple)
            $select = self::$columnasTablasSimples[$tabla] ?? [
                "id_{$tabla} as id",
                "{$tabla} as label",
            ];
            $item = DB::table($tabla)
                ->select($select)
                ->where("id_{$tabla}", $id)
                ->first();
            return [
                'success' => $item !== null,
                'data'    => $item ?: null,
                'message' => $item ? null : "No encontrado",
            ];
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }
    /**
     * Tablas permitidas.
     */
    public static function getTablasPermitidas(): array
    {
        return self::$tablasPermitidas;
    }
    /**
     * Método genérico para consultas con joins.
     */
    protected function fetch(string $from, array $joins, array $select): array
    {
        try {
            $query = DB::table($from);
            foreach ($joins as $join) {
                if ($join[0] === 'join') {
                    $query->join($join[1], $join[2], $join[3], $join[4]);
                } elseif ($join[0] === 'where') {
                    $query->where($join[1], $join[2], $join[3]);
                }
            }
            $data = $query
                ->select($select)
                ->orderBy('label', 'asc')
                ->get()
                ->toArray();

            return [
                'success' => true,
                'data'    => $data,
                'message' => null,
            ];
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }
    /**
     * Lista especial de mascotas: cliente + mascota.
     */
    public function getListaMascota(): array
    {
        return $this->fetch(
            'mascota as m',
            [
                ['join', 'cliente as c', 'm.id_cliente', '=', 'c.id_cliente'],
            ],
            [
                'm.id_mascota as id',
                DB::raw("CONCAT(m.mascota, ' - ', c.cliente) as label"),
            ]
        );
    }
    /**
     * Lista especial de razas: especie + raza.
     */
    public function getListaRaza(): array
    {
        return $this->fetch(
            'raza as r',
            [
                ['join', 'especie as e', 'r.id_especie', '=', 'e.id_especie'],
            ],
            [
                'r.id_raza as id',
                DB::raw("CONCAT(e.especie, ' - ', r.raza) as label"),
            ]
        );
    }
    // Manejo de errores, queda feo si no lo haces así
    protected function handleException(\Exception $e): array
    {
        return [
            'success' => false,
            'data'    => null,
            'message' => $e->getMessage(),
        ];
    }
}