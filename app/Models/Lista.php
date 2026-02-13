<?php
namespace App\Models;
use Illuminate\Support\Facades\DB;
class Lista
{
    protected static array $tablasPermitidas = [
        'sexo','producto','procedimiento','cliente','mascota','estado_cita',
        'estado_mascota','motivo_cita','motivo_historia_clinica',
        'estado_historia_clinica','especie','unidad_tiempo','raza',
        'rol','categoria',
    ];
    protected static array $columnasTablasSimples = [
        // 'especialidad' => ['id_especialidad as id','especialidad as label'],
    ];
    protected static array $listasEspeciales = [
        'id_mascota' => 'getListaMascota',
        'id_raza'    => 'getListaRaza',
    ];
    // Tablas que tienen emoji y su campo correspondiente
    protected static array $tablasConEmoji = [
        'categoria' => 'emoji_categoria',
        'sexo'      => 'emoji_sexo',
        'especie'   => 'emoji_especie',
    ];
    /* ===================== Helpers ===================== */
    protected function normalizarTabla(string $valor): string
    {
        $valor = strtolower(trim($valor));
        return preg_match('/^id_/', $valor) ? substr($valor, 3) : $valor; // Quita prefijo id_
    }
    protected function validarTabla(string $tabla): ?array
    {
        return in_array($tabla, self::$tablasPermitidas, true)
            ? null
            : ['success'=>false,'data'=>null,'message'=>"Tabla no permitida: {$tabla}"];
    }
    protected function columnas(string $tabla): array
    {
        if (isset(self::$columnasTablasSimples[$tabla])) {
            return self::$columnasTablasSimples[$tabla]; // Columnas personalizadas
        }
        if (isset(self::$tablasConEmoji[$tabla])) {
            $emoji = self::$tablasConEmoji[$tabla];
            return [
                "id_{$tabla} as id",
                DB::raw("CONCAT({$emoji}, ' ', {$tabla}) as label"), // Emoji + texto
            ];
        }
        return ["id_{$tabla} as id","{$tabla} as label"]; // Caso normal
    }
    protected function response(bool $ok, $data=null, ?string $msg=null): array
    {
        return ['success'=>$ok,'data'=>$data,'message'=>$msg];
    }
    /* ===================== Listas ===================== */
    public function getLista(string $tabla): array
    {
        $tabla = $this->normalizarTabla($tabla);
        if ($err = $this->validarTabla($tabla)) return $err;

        try {
            $data = DB::table($tabla)
                ->select($this->columnas($tabla))
                ->orderBy('label')
                ->get()
                ->toArray();

            return $this->response(true, $data);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }
    public function getListaDinamica(string $clave, $param=null): array
    {
        if (isset(self::$listasEspeciales[$clave]) && method_exists($this, self::$listasEspeciales[$clave])) {
            return $this->{self::$listasEspeciales[$clave]}($param);
        }
        return $this->getLista($clave);
    }
    public function getItemById(string $tablaOrCampo, int $id): array
    {
        $tabla = $this->normalizarTabla($tablaOrCampo);
        if ($err = $this->validarTabla($tabla)) return $err;
        try {
            $key = "id_{$tabla}";
            if (isset(self::$listasEspeciales[$key])) {
                $list = $this->{self::$listasEspeciales[$key]}();
                if (!$list['success']) return $list;

                $item = collect($list['data'])->firstWhere('id', $id);
                return $this->response($item !== null, $item, $item ? null : 'No encontrado');
            }
            $item = DB::table($tabla)
                ->select($this->columnas($tabla))
                ->where("id_{$tabla}", $id)
                ->first();

            return $this->response($item !== null, $item, $item ? null : 'No encontrado');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }
    public static function getTablasPermitidas(): array
    {
        return self::$tablasPermitidas;
    }
    /* ===================== Consultas especiales ===================== */
    protected function fetch(string $from, array $joins, array $select): array
    {
        try {
            $q = DB::table($from);
            foreach ($joins as [$t,$a,$b,$c,$d]) {
                $t === 'join' ? $q->join($a,$b,$c,$d) : $q->where($a,$b,$c); // Join o where
            }

            return $this->response(
                true,
                $q->select($select)->orderBy('label')->get()->toArray()
            );
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }
    public function getListaMascota(): array
    {
        return $this->fetch(
            'mascota as m',
            [['join','cliente as c','m.id_cliente','=','c.id_cliente']],
            ['m.id_mascota as id', DB::raw("CONCAT(m.mascota,' - ',c.cliente) as label")]
        );
    }
    public function getListaRaza(): array
    {
        return $this->fetch(
            'raza as r',
            [['join','especie as e','r.id_especie','=','e.id_especie']],
            ['r.id_raza as id', DB::raw("CONCAT(e.emoji_especie,'  ',r.raza) as label")]
        );
    }
    protected function handleException(\Exception $e): array
    {
        return $this->response(false, null, $e->getMessage());
    }
}