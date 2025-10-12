<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Historia Clínica PDF</title>
    <style>
        @page { margin: 10mm; }
        body { font-family: DejaVu Sans, sans-serif; margin: 0; padding: 0; font-size: 12px; }

        .header { position: relative; width: 100%; text-align: center; padding: 20px 0; }
        .logo { position: absolute; left: 20px; top: 0; }
        .logo img { width: 80px; height: auto; }
        .title { font-size: 22px; font-weight: bold; margin: 0; }

        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 5px 10px; border: 1px solid #000; font-size: 12px; }
        th { font-weight: bold; background-color: #f2f2f2; }
        td.nombres { width: 35%; }
        td.telefono { width: 25%; }
        td.direccion { width: 40%; }
        td.fecha { text-align: right; font-weight: bold; }
        td.paciente { width: 16%; }
    </style>
</head>
<body>

    <div class="header">
        <div class="logo">
            <img src="{{ public_path('logo.png') }}" alt="Logo">
        </div>
        <div class="title">HISTORIA CLÍNICA</div>
    </div>

    <!-- Datos del propietario -->
    <table>
        <thead>
            <tr>
                <th colspan="2" width="60%">Datos de propietario</th>
                <th width="40%" style="text-align: right;">Fecha: {{ $historia_clinica->created_at ?? 'N/A' }}</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="nombres"><b>Nombres:</b> {{ $historia_clinica->mascota->cliente->cliente ?? 'N/A' }}</td>
                <td class="telefono"><b>Teléfono:</b> {{ $historia_clinica->mascota->cliente->telefono ?? 'N/A' }}</td>
                <td class="direccion"><b>Dirección:</b> {{ $historia_clinica->mascota->cliente->direccion ?? 'N/A' }}</td>
            </tr>
        </tbody>
    </table>

    <!-- Datos del paciente -->
    <table>
        <thead>
            <tr>
                <th colspan="6">Datos de paciente</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="paciente"><b>Nombre:</b> {{ $historia_clinica->mascota->mascota ?? 'N/A' }}</td>
                <td class="paciente"><b>Especie:</b> {{ optional(optional($historia_clinica->mascota->raza)->especie)->especie ?? 'N/A' }}</td>
                <td class="paciente"><b>Raza:</b> {{ optional($historia_clinica->mascota->raza)->raza ?? 'N/A' }}</td>
                <td class="paciente"><b>Peso:</b> {{ $historia_clinica->mascota->peso ?? 'N/A' }} kg</td>
                <td class="paciente"><b>Sexo:</b> {{ optional($historia_clinica->mascota->sexo)->sexo ?? 'N/A' }}</td>
                <td class="paciente">
                    <b>Edad:</b>
                    @php
                        $edad = $historia_clinica->mascota->edad ?? null;
                        $unidad = optional($historia_clinica->mascota->unidad_tiempo)->unidad_tiempo ?? null;

                        if ($edad !== null && $unidad) {
                            $unidad = mb_strtolower($unidad, 'UTF-8');
                            if (in_array($unidad, ['año', 'años'])) {
                                $unidad = $edad == 1 ? 'AÑO' : 'AÑOS';
                            } elseif (in_array($unidad, ['mes', 'meses'])) {
                                $unidad = $edad == 1 ? 'MES' : 'MESES';
                            } else {
                                $unidad = strtoupper($unidad);
                            }
                            echo $edad . ' ' . $unidad;
                        } else {
                            echo 'N/A';
                        }
                    @endphp
                </td>
            </tr>
        </tbody>
    </table>

    <!-- Motivo -->
       <!-- Motivo -->
    <table>
        <thead>
            <tr>
                <th width="30%">Motivo de historia</th>
                <th width="50%">Detalle de motivo</th>
                <th width="20%">Estado Historia</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ optional($historia_clinica->motivo_historia)->motivo_historia_clinica ?? 'N/A' }}</td>
                <td>{{ $historia_clinica->detalle ?? 'N/A' }}</td>
                <td>{{ optional($historia_clinica->estado_historia_clinica)->estado_historia_clinica ?? 'N/A' }}</td>
            </tr>
        </tbody>
    </table>


        @php
        $actividades = collect();

        // Seguimientos
        $actividades = $actividades->merge(
            $historia_clinica->historia_seguimientos->map(fn($s) => [
                'fecha' => $s->created_at,
                'tipo' => 'Seguimiento',
                'detalle' => "Detalle: " . ($s->detalle ?? 'N/A') . 
                             "<br>Observaciones: " . ($s->observaciones ?? 'N/A'),
                'precio' => 0
            ])
        );

        // Procedimientos
        $actividades = $actividades->merge(
            $historia_clinica->historia_procedimientos->map(fn($p) => [
                'fecha' => $p->created_at,
                'tipo' => 'Procedimiento',
                'detalle' => "Procedimiento: " . (optional($p->procedimiento)->procedimiento ?? 'N/A') .
                             "<br>Detalle: " . ($p->detalle ?? 'N/A') .
                             "<br>Precio: S/ " . number_format($p->precio ?? 0, 2),
                'precio' => $p->precio ?? 0
            ])
        );

        // Medicamentos
        $actividades = $actividades->merge(
            $historia_clinica->historia_medicamentos->map(fn($m) => [
                'fecha' => $m->created_at,
                'tipo' => 'Medicamento',
                'detalle' => "Medicamento: " . (optional($m->medicamento)->medicamento ?? 'N/A') .
                             "<br>Dosis: " . ($m->dosis ?? 'N/A') .
                             "<br>Precio: S/ " . number_format($m->precio ?? 0, 2) .
                             "<br>Observaciones: " . ($m->observaciones ?? 'N/A'),
                'precio' => $m->precio ?? 0
            ])
        );

        // Anamnesis
        $actividades = $actividades->merge(
            $historia_clinica->historia_anamnesis->map(fn($a) => [
                'fecha' => $a->created_at,
                'tipo' => 'Anamnesis',
                'detalle' =>
                    "Temperatura: " . ($a->temperatura ?? 'N/A') . "°C<br>" .
                    "Frecuencia cardiaca: " . ($a->frecuencia_cardiaca ?? 'N/A') . " lpm<br>" .
                    "Frecuencia respiratoria: " . ($a->frecuencia_respiratoria ?? 'N/A') . " rpm<br>" .
                    "Tiempo llenado capilar: " . ($a->tiempo_llenado_capilar ?? 'N/A') . " seg",
                'precio' => 0
            ])
        );

        $actividades = $actividades->sortBy('fecha');

        // Calcular total de precios
        $total = $actividades->sum('precio');
    @endphp

    <table>
        <thead>
            <tr>
                <th colspan="3" style="text-align:center; font-weight:bold; background-color:#f2f2f2;">
                    REGISTRO DE ACTIVIDADES
                </th>
            </tr>
            <tr>
                <th width="20%">Fecha</th>
                <th width="16%">Tipo</th>
                <th width="64%">Descripción</th>
            </tr>
        </thead>
        <tbody>
            @forelse($actividades as $actividad)
                <tr>
                    <td>{{ \Carbon\Carbon::parse($actividad['fecha'])->format('d/m/Y H:i') ?? 'N/A' }}</td>
                    <td><b>{{ $actividad['tipo'] }}</b></td>
                    <td>{!! $actividad['detalle'] !!}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="3" style="text-align:center;">No hay actividades registradas</td>
                </tr>
            @endforelse

            <tr>
                <td colspan="2" style="text-align:right; font-weight:bold;">Total S/</td>
                <td style="font-weight:bold;">{{ number_format($total, 2) }}</td>
            </tr>
        </tbody>
    </table>

</body>
</html>
