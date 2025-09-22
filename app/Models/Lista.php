<?php
namespace App\Models;
use Illuminate\Support\Facades\DB;
class Lista
{
    protected static array $tablasPermitidas = [
     'sexo', 'cliente', 'mascota', 'estado_cita', 'estado_mascota', 'motivo_cita',
    ];
    protected static array $columnasTablasSimples = [
        //'especialidad' => ['id_especialidad as id', 'especialidad as label'],
    ];
    protected static array $listasEspeciales = [
       // 'id_mascota' => 'getListaMascota',
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
    // Métodos especiales
    public function getListaMascota(): array
    {
        return $this->fetch(
            'mascota as m',
            [
                ['join', 'cliente as c', 'm.id_mascota', '=', 'c.id_cliente'],
            ],
            [
                'm.id_mascota as id',
                DB::raw("CONCAT(m.mascota, ' - ', c.cliente) as label")
            ]
        );
    }
    public function getListaDelegado(): array
    {
        return $this->fetch(
            'delegado as d',
            [
                ['join', 'pfildelegado as p', 'd.id_pfildelegado', '=', 'p.id_pfildelegado'],
                ['join', 'distrito as di', 'd.id_distrito', '=', 'di.id_distrito'],
                ['join', 'especialidad as e', 'p.id_especialidad', '=', 'e.id_especialidad'],
                ['where', 'p.id_estado_delega', '=', 1]
            ],
            [
                'd.id_delegado as id',
                DB::raw("CONCAT('CIP-', p.cip, ' ', p.apaterno, ' ', p.amaterno, ' ', p.nombres, ' - ', e.especialidad, ' - ', di.distrito) as label")
            ]
        );
    }
    public function getListaPfildelegado(): array
    {
        return $this->simpleSelect(
            'pfildelegado',
            ['id_pfildelegado as id', DB::raw("CONCAT('CIP-', cip, ' ', apaterno, ' ', amaterno, ' ', nombres) as label")],
            ['id_estado_delega' => 1]
        );
    }
    public function getListaPfildelegado2(): array
    {
        return $this->simpleSelect(
            'pfildelegado',
            ['id_pfildelegado as id', DB::raw("CONCAT('CIP-', cip) as label")],
            ['id_estado_delega' => 1]
        );
    }
    public function getListaPersonaN(): array
    {
        return $this->simpleSelect(
            'persona_n',
            ['id_persona_n as id', DB::raw("CONCAT(apaterno, ' ', amaterno, ' ', nombres) as label")]
        );
    }
    public function getListaPersonaJ(): array
    {
        return $this->simpleSelect(
            'persona_j',
            ['id_persona_j as id', 'razon as label']
        );
    }
    public function getListaPeriodoVigenciaDelega(): array
    {
        return $this->simpleSelect(
            'periovigenciadelega',
            [
                'id_periovigenciadelega as id',
                DB::raw("CONCAT('Desde ', DATE_FORMAT(fechadesde, '%d/%m/%Y'), ' hasta ', DATE_FORMAT(fechahasta, '%d/%m/%Y')) as label"),
                'fechadesde',
                'fechahasta',
            ]
        );
    }
    public function getPrevio1Options($tipo_liquid = null): array
    {
        return $this->getHistorico('historico_tasa_liquid', 'id_historico_tasa_liquid', $tipo_liquid, function ($row) {
            $periodo = $this->formatearPeriodo($row->fecha_i_vigencia, $row->fecha_f_vigencia);
            return [
                'id' => $row->id_historico_tasa_liquid,
                'label' => "{$periodo} (TASA: {$row->valor_tasa})"
            ];
        });
    }
    public function getPrevio2Options($tipo_liquid = null): array
    {
        return $this->getHistorico('historico_derecho', 'id_historico_derecho', $tipo_liquid, function ($row) {
            $periodo = $this->formatearPeriodo($row->fecha_i_vigencia, $row->fecha_f_vigencia);
            return [
                'id' => $row->id_historico_derecho,
                'label' => "{$periodo} (MIN: {$row->valor_minimo} & MAX: {$row->valor_maximo})",
                'valor_minimo' => $row->valor_minimo,
                'valor_maximo' => $row->valor_maximo,
            ];
        });
    }
    public function getPrevio3Options($tipo_liquid = null): array
    {
        return $this->getHistorico('historico_tasa_delegado', 'id_historico_tasa_delegado', $tipo_liquid, function ($row) {
            $periodo = $this->formatearPeriodo($row->fecha_i_vigencia, $row->fecha_f_vigencia);
            return [
                'id' => $row->id_historico_tasa_delegado,
                'label' => "{$periodo} (FONDO COMÚN: {$row->fondo_comun} - APORTE CAM: {$row->aporte_codemu} - RENTA CIP: {$row->renta_cip})",
                'fondo_comun' => $row->fondo_comun,
                'aporte_codemu' => $row->aporte_codemu,
                'renta_cip' => $row->renta_cip,
            ];
        });
    }
    public function getPrevio4Options(): array
    {
        return $this->getImpuesto(1, 'IGV');
    }
    public function getPrevio5Options(): array
    {
        return $this->getImpuesto(2, 'UIT');
    }
    public function getPrevio6Options(): array
    {
        return $this->getHistorico('historico_catego_sup', 'id_historico_catego_sup', null, function ($row) {
            $periodo = $this->formatearPeriodo($row->fecha_i_vigencia, $row->fecha_f_vigencia);
            return [
                'id' => $row->id_historico_catego_sup,
                'label' => "{$periodo} (1: {$row->categoria1} - 2: {$row->categoria2} - 3: {$row->categoria3} - 4: {$row->categoria4})",
                'categoria1' => $row->categoria1,
                'categoria2' => $row->categoria2,
                'categoria3' => $row->categoria3,
                'categoria4' => $row->categoria4,
            ];
        });
    }
    // Consulta simple con filtros opcionales
    protected function simpleSelect(string $tabla, array $select, array $where = []): array
    {
        try {
            $query = DB::table($tabla)->select($select);

            if (!empty($where)) {
                $query->where($where);
            }
            $data = $query->orderByDesc("id_{$tabla}")->get()->toArray();
            return [
                'success' => true,
                'data' => $data,
                'message' => null,
            ];
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }
    // Consulta con joins y filtros
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
    // Consulta histórica con formato personalizado
    protected function getHistorico(string $tabla, string $idCampo, $tipo_liquid = null, callable $formatter): array
    {
        try {
            $query = DB::table($tabla)->orderByDesc($idCampo);

            if ($tipo_liquid !== null && DB::getSchemaBuilder()->hasColumn($tabla, 'tipo_liquid')) {
                $query->where('tipo_liquid', $tipo_liquid);
            }
            $data = $query->get()->map($formatter)->toArray();
            return [
                'success' => true,
                'data' => $data,
                'message' => null,
            ];
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }
    // Consulta de impuestos
    protected function getImpuesto(int $id, string $nombre): array
    {
        try {
            $rows = DB::table('historico_tasa')
                ->where('id_impuesto', $id)
                ->orderByDesc('id_historico_impuesto')
                ->get();
            if ($rows->isEmpty()) {
                return [
                    'success' => true,
                    'data' => [],
                    'message' => null,
                ];
            }
            $data = $rows->map(function ($row) use ($nombre) {
                $periodo = $this->formatearPeriodo($row->fecha_i_vigencia, $row->fecha_f_vigencia);
                return [
                    'id' => $row->id_historico_impuesto,
                    'label' => "{$periodo} ({$nombre}: {$row->valor})",
                    'valor' => $row->valor,
                ];
            })->toArray();
            return [
                'success' => true,
                'data' => $data,
                'message' => null,
            ];
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }
    // Formatea un período de fechas
    protected function formatearPeriodo(?string $fechaInicio, ?string $fechaFin): string
    {
        $inicio = $fechaInicio ? date('d/m/Y', strtotime($fechaInicio)) : 'N/A';
        $fin = $fechaFin ? date('d/m/Y', strtotime($fechaFin)) : 'N/A';
        return "{$inicio} - {$fin}";
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