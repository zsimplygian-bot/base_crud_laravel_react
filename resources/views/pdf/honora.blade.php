<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Listado de Honorarios</title>
    <style>
        @page {
            margin: 10mm;
        }
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 15px;
            margin: 0;
            padding: 0;
        }
        .header-table {
            width: 100%;
            margin-bottom: 10px;
        }
        .header-table td {
            vertical-align: top;
        }
        .header-table img {
            width: 90px;
            height: auto;
        }
        .title {
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            text-decoration: underline;
            margin: 10px 0;
        }
        table.data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        table.data-table th, table.data-table td {
            border: 1px solid #000;
            padding: 8px;
            font-size: 11px;
            text-align: center;
        }
        table.data-table th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
    </style>
</head>
<body>
<table class="header-table">
    <tr>
        <td style="width: 90px;">
            <img src="{{ public_path('logo.png') }}" alt="Logo">
        </td>
        <td style="text-align: center;">
            <div style="font-weight: bold;">COLEGIO DE INGENIEROS DEL PERÚ</div>
            <div>Consejo Departamental de Lima</div>
            <div>Comisión de Asuntos Municipales</div>
        </td>
        <td style="text-align: right;">
            <div class="title">
                PAGOS A DELEGADOS POR<br>
                {{ $honora->tipoLiquid->tipo_liquid ?? 'N/A' }}
            </div>
        </td>
    </tr>
</table>
<p class="delegado" style="">
    <span style="font-weight: bold;">DELEGADO:</span>
    <span style="">
        {{ $honora->delegado->pfildelegado->apaterno ?? 'N/A' }} 
        {{ $honora->delegado->pfildelegado->amaterno ?? '' }} 
        {{ $honora->delegado->pfildelegado->nombres ?? '' }}
    </span>
</p>
<table class="data-table">
    <thead>
        <tr style="background-color: #f2f2f2;">
            <th>ID</th>
            <th>Fecha</th>
            <th>Municipio</th>
            <th>Importe Bruto</th>
            <th>APCAM</th>
            <th>CDLIMA</th>
            <th>FONDOC</th>
            <th>Honorario</th>
        </tr>
    </thead>
    <tbody>
        @foreach($honoras as $honora)
            <tr>
                <td>{{ $honora->id_detalle_liquidacion }}</td>
                <td>{{ \Carbon\Carbon::parse($honora->fechapre)->format('d/m/Y') }}</td>
                <td>{{ $honora->distrito->distrito ?? 'N/A' }}</td>
                <td>{{ number_format($honora->imp_bruto ?? 0, 2) }}</td>
                <td>{{ number_format($honora->fondoco ?? 0, 2) }}</td>
                <td>{{ number_format($honora->aposis ?? 0, 2) }}</td>
                <td>{{ number_format($honora->rentacip ?? 0, 2) }}</td>
                <td>{{ number_format($honora->honora ?? 0, 2) }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
</body>
</html>
