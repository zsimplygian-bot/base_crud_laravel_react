<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Historia Clínica PDF</title>
<style>
@page{margin:10mm;}
body{font-family:DejaVu Sans,sans-serif;font-size:12px;margin:0}
.header{position:relative;text-align:center;padding:20px 0}
.logo{position:absolute;left:20px;top:0}
.logo img{width:80px}
.title{font-size:22px;font-weight:bold}
table{width:100%;border-collapse:collapse;margin-top:20px}
th,td{border:1px solid #000;padding:5px 10px;vertical-align:top}
th{background:#f2f2f2;font-weight:bold}
.fecha{text-align:right;font-weight:bold}
.paciente{width:16%}
</style>
</head>
<body>

@php
    $na = fn($v) => isset($v) && trim($v) !== '' ? $v : null;
    $fmt = fn($d) => $d ? \Carbon\Carbon::parse($d)->format('d/m/Y H:i') : null;

    $hc = $historia_clinica;
    $mascota = $hc->mascota;
    $cliente = $mascota->cliente;

    // Edad total
    $edadBaseMeses = (int) ($mascota->edad ?? 0);

    if ($mascota->created_at) {
        $inicio = \Carbon\Carbon::parse($mascota->created_at);
        $diff = $inicio->diff(\Carbon\Carbon::now());
        $edadTotalMeses = $edadBaseMeses + ($diff->y * 12) + $diff->m;

        if ($edadTotalMeses < 12) {
            $edadFmt = $edadTotalMeses.' '.($edadTotalMeses === 1 ? 'mes' : 'meses');
        } else {
            $anios = intdiv($edadTotalMeses,12);
            $meses = $edadTotalMeses % 12;
            $edadFmt = $anios.' '.($anios === 1 ? 'año' : 'años');
            if ($meses > 0) $edadFmt .= ' y '.$meses.' '.($meses === 1 ? 'mes' : 'meses');
        }
    } else {
        $edadFmt = $edadBaseMeses ? $edadBaseMeses.' meses' : 'N/A';
    }

    // Actividades normalizadas con fecha real para ordenar
    $actividades = collect()
        ->merge($hc->historia_seguimientos->map(fn($s)=>[
            'fecha_raw'=>$s->fecha,
            'tipo'=>'Seguimiento',
            'detalle'=>array_filter([
                $na($s->detalle) ? "Detalle: {$s->detalle}" : null,
                $na($s->observaciones) ? "Observaciones: {$s->observaciones}" : null,
            ]),
            'precio'=>0
        ]))
        ->merge($hc->historia_procedimientos->map(fn($p)=>[
            'fecha_raw'=>$p->fecha,
            'tipo'=>'Procedimiento',
            'detalle'=>array_filter([
                $na($p->procedimiento?->procedimiento) ? "Procedimiento: {$p->procedimiento->procedimiento}" : null,
                $na($p->detalle) ? "Detalle: {$p->detalle}" : null,
                $p->precio ? "Precio: S/ ".number_format($p->precio,2) : null,
            ]),
            'precio'=>$p->precio ?? 0
        ]))
        ->merge($hc->historia_medicamentos->map(fn($m)=>[
            'fecha_raw'=>$m->fecha,
            'tipo'=>'Medicamento',
            'detalle'=>array_filter([
                $na($m->medicamento?->medicamento) ? "Medicamento: {$m->medicamento->medicamento}" : null,
                $na($m->dosis) ? "Dosis: {$m->dosis}" : null,
                $m->precio ? "Precio: S/ ".number_format($m->precio,2) : null,
                $na($m->observaciones) ? "Observaciones: {$m->observaciones}" : null,
            ]),
            'precio'=>$m->precio ?? 0
        ]))
        ->merge($hc->historia_anamnesis->map(fn($a)=>[
            'fecha_raw'=>$a->fecha,
            'tipo'=>'Anamnesis',
            'detalle'=>array_filter([
                $na($a->temperatura) ? "Temperatura: {$a->temperatura} °C" : null,
                $na($a->frecuencia_cardiaca) ? "Frecuencia cardiaca: {$a->frecuencia_cardiaca} lpm" : null,
                $na($a->frecuencia_respiratoria) ? "Frecuencia respiratoria: {$a->frecuencia_respiratoria} rpm" : null,
                $na($a->tiempo_llenado_capilar) ? "TLC: {$a->tiempo_llenado_capilar} seg" : null,
            ]),
            'precio'=>0
        ]))
        ->sortBy(fn($a)=>\Carbon\Carbon::parse($a['fecha_raw']))
        ->values();

    $total = $actividades->sum('precio');
@endphp

<div class="header">
    <div class="logo">
        <img src="{{ public_path('logo.png') }}">
    </div>
    <div class="title">HISTORIA CLÍNICA</div>
</div>

<table>
<thead>
<tr>
    <th colspan="2">Datos del propietario</th>
    <th class="fecha">Fecha: {{ $fmt($hc->created_at) }}</th>
</tr>
</thead>
<tbody>
<tr>
    <td><b>Nombres:</b> {{ $na($cliente->cliente) ?? 'N/A' }}</td>
    <td><b>Teléfono:</b> {{ $na($cliente->telefono) ?? 'N/A' }}</td>
    <td><b>Dirección:</b> {{ $na($cliente->direccion) ?? 'N/A' }}</td>
</tr>
</tbody>
</table>

<table>
<thead><tr><th colspan="6">Datos del paciente</th></tr></thead>
<tbody>
<tr>
<td class="paciente"><b>Nombre:</b> {{ $na($mascota->mascota) ?? 'N/A' }}</td>
<td class="paciente"><b>Especie:</b> {{ $na($mascota->raza?->especie?->especie) ?? 'N/A' }}</td>
<td class="paciente"><b>Raza:</b> {{ $na($mascota->raza?->raza) ?? 'N/A' }}</td>
<td class="paciente"><b>Peso:</b> {{ $na($mascota->peso) ? $mascota->peso.' kg' : 'N/A' }}</td>
<td class="paciente"><b>Sexo:</b> {{ $na($mascota->sexo?->sexo) ?? 'N/A' }}</td>
<td class="paciente"><b>Edad:</b> {{ $edadFmt }}</td>
</tr>
</tbody>
</table>
<table>
<thead>
<tr>
    <th width="30%">Motivo de historia</th>
    <th width="50%">Detalle de motivo</th>
    <th width="20%">Estado historia</th>
</tr>
</thead>
<tbody>
<tr>
    <td>{{ $na($hc->motivo_historia_clinica?->motivo_historia_clinica) }}</td>
    <td>{{ $na($hc->detalle) }}</td>
    <td>{{ $na($hc->estado_historia_clinica?->estado_historia_clinica) }}</td>
</tr>
</tbody>
</table>
<table>
<thead>
<tr><th>Fecha</th><th>Tipo</th><th>Descripción</th></tr>
</thead>
<tbody>
@forelse($actividades as $a)
<tr>
<td>{{ $fmt($a['fecha_raw']) }}</td>
<td><b>{{ $a['tipo'] }}</b></td>
<td>
@foreach($a['detalle'] as $linea)
    {{ $linea }}<br>
@endforeach
</td>
</tr>
@empty
<tr><td colspan="3" style="text-align:center">No hay actividades</td></tr>
@endforelse
<tr>
<td colspan="2" style="text-align:right;font-weight:bold">Total S/</td>
<td style="font-weight:bold">{{ number_format($total,2) }}</td>
</tr>
</tbody>
</table>

</body>
</html>
