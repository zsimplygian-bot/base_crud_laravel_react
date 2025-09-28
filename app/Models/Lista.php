<?php
namespace App\Models;
use Illuminate\Support\Facades\DB;
class Lista
{
    protected static array $tablasPermitidas = [
     'sexo', 'cliente', 'mascota', 'estado_cita', 'estado_mascota', 'motivo_cita', 'estado_historia_clinica', 'especie',
    ];
    protected static array $columnasTablasSimples = [
        //'especialidad' => ['id_especialidad as id', 'especialidad as label'],
    ];
    protected static array $listasEspeciales = [
       'id_mascota' => 'getListaMascota',
       'id_raza' => 'getListaRaza',
    ];
    // Lista simple desde tabla permitida
    public function getLista(string $tabla): array
    {
        $tabla = strtolower(trim($tabla));
        if (!in_array($tabla, self::$tablasPermitidas, true)) {
            return [
                'success' => false,
                'data' => null,
                'message' => "Tabla no permitida: {$tabla}",
            ];
        }
        try {
            $select = self::$columnasTablasSimples[$tabla] ?? [
                "id_{$tabla} as id",
                "{$tabla} as label"
            ];
            $data = DB::table($tabla)
                ->select($select)
                ->orderBy("id_{$tabla}")
                ->get()
                ->toArray();
            return [
                'success' => true,
                'data' => $data,
                'message' => null,
            ];
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }
    // Tablas permitidas
    public static function getTablasPermitidas(): array
    {
        return self::$tablasPermitidas;
    }
    // Lista dinámica (simple o especial)
    public function getListaDinamica(string $clave, $param = null): array
    {
        if (isset(self::$listasEspeciales[$clave]) && method_exists($this, self::$listasEspeciales[$clave])) {
            return $this->{self::$listasEspeciales[$clave]}($param);
        }
        $claveNormalizada = preg_match('/^id_/', $clave) ? substr($clave, 3) : $clave;
        return $this->getLista($claveNormalizada);
    }
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
            $data = $query->select($select)->get()->toArray();
            return [
                'success' => true,
                'data' => $data,
                'message' => null,
            ];
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }
    // Métodos especiales
   public function getListaMascota(): array
    {
        return $this->fetch(
            'mascota as m',
            [
                ['join', 'cliente as c', 'm.id_cliente', '=', 'c.id_cliente'],
            ],
            [
                'm.id_mascota as id',
                DB::raw("CONCAT(c.cliente, ' - ', m.mascota) as label")
            ]
        );
    }
    public function getListaRaza(): array
    {
        return $this->fetch(
            'raza as r',
            [
                ['join', 'especie as e', 'r.id_especie', '=', 'e.id_especie'],
            ],
            [
                'r.id_raza as id',
                DB::raw("CONCAT(e.especie, ' - ', r.raza) as label")
            ]
        );
    }
    // Manejo genérico de excepciones
    protected function handleException(\Exception $e): array
    {
        return [
            'success' => false,
            'data' => null,
            'message' => $e->getMessage(),
        ];
    }
}