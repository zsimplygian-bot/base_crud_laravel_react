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
th,td{border:1px solid #000;padding:5px 10px}
th{background:#f2f2f2;font-weight:bold}
.fecha{text-align:right;font-weight:bold}
.paciente{width:16%}
</style>
</head>
<body>
@php
    // Helpers simples
    $na = fn($v) => $v ?: 'N/A';
    $fmt = fn($d) => $d ? \Carbon\Carbon::parse($d)->format('d/m/Y H:i') : 'N/A';
    $hc = $historia_clinica;
    $mascota = $hc->mascota;
    $cliente = $mascota->cliente;
    $actividades = collect()
        ->merge($hc->historia_seguimientos->map(fn($s)=>[
            'fecha'=>$s->created_at,
            'tipo'=>'Seguimiento',
            'detalle'=>"Detalle: ".$na($s->detalle)."<br>Observaciones: ".$na($s->observaciones),
            'precio'=>0
        ]))
        ->merge($hc->historia_procedimientos->map(fn($p)=>[
            'fecha'=>$p->created_at,
            'tipo'=>'Procedimiento',
            'detalle'=>"Procedimiento: ".$na($p->procedimiento?->procedimiento).
                      "<br>Detalle: ".$na($p->detalle).
                      "<br>Precio: S/ ".number_format($p->precio ?? 0,2),
            'precio'=>$p->precio ?? 0
        ]))
        ->merge($hc->historia_medicamentos->map(fn($m)=>[
            'fecha'=>$m->created_at,
            'tipo'=>'Medicamento',
            'detalle'=>"Medicamento: ".$na($m->medicamento?->medicamento).
                      "<br>Dosis: ".$na($m->dosis).
                      "<br>Precio: S/ ".number_format($m->precio ?? 0,2).
                      "<br>Observaciones: ".$na($m->observaciones),
            'precio'=>$m->precio ?? 0
        ]))
        ->merge($hc->historia_anamnesis->map(fn($a)=>[
            'fecha'=>$a->created_at,
            'tipo'=>'Anamnesis',
            'detalle'=>"Temperatura: ".$na($a->temperatura)." °C<br>".
                      "Frecuencia cardiaca: ".$na($a->frecuencia_cardiaca)." lpm<br>".
                      "Frecuencia respiratoria: ".$na($a->frecuencia_respiratoria)." rpm<br>".
                      "TLC: ".$na($a->tiempo_llenado_capilar)." seg",
            'precio'=>0
        ]))
        ->sortBy('fecha');
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
    <td><b>Nombres:</b> {{ $na($cliente->cliente) }}</td>
    <td><b>Teléfono:</b> {{ $na($cliente->telefono) }}</td>
    <td><b>Dirección:</b> {{ $na($cliente->direccion) }}</td>
</tr>
</tbody>
</table>
<table>
<thead><tr><th colspan="6">Datos del paciente</th></tr></thead>
<tbody>
<tr>
<td class="paciente"><b>Nombre:</b> {{ $na($mascota->mascota) }}</td>
<td class="paciente"><b>Especie:</b> {{ $na($mascota->raza?->especie?->especie) }}</td>
<td class="paciente"><b>Raza:</b> {{ $na($mascota->raza?->raza) }}</td>
<td class="paciente"><b>Peso:</b> {{ $na($mascota->peso) }} kg</td>
<td class="paciente"><b>Sexo:</b> {{ $na($mascota->sexo?->sexo) }}</td>
<td class="paciente"><b>Edad:</b> {{ $na($mascota->edad) }}</td>
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
<tr>
<th>Fecha</th><th>Tipo</th><th>Descripción</th>
</tr>
</thead>
<tbody>
@forelse($actividades as $a)
<tr>
<td>{{ $fmt($a['fecha']) }}</td>
<td><b>{{ $a['tipo'] }}</b></td>
<td>{!! $a['detalle'] !!}</td>
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