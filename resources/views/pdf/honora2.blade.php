<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Listado de Honorarios Supervisión</title>
    <style>
        @page {
            margin: 10mm;
        }
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 13px;
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
        .delegado-info {
            margin: 10px 0;
            font-weight: bold;
        }
        table.data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        table.data-table th, table.data-table td {
            border: 1px solid #000;
            padding: 6px;
            font-size: 11px;
            text-align: center;
        }
        table.data-table th {
            background-color: #f2f2f2;
        }
        .totals {
            font-weight: bold;
            background-color: #e0e0e0;
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
                <div><strong>COLEGIO DE INGENIEROS DEL PERÚ</strong></div>
                <div>Consejo Departamental de Lima</div>
                <div>Comisión de Supervisión de Obras</div>
            </td>
            <td style="text-align: right;">
                <div class="title">
                    LIQUIDACIÓN DE HONORARIOS A DELEGADOS
                </div>
            </td>
        </tr>
    </table>

    <p class="delegado-info">
        DELEGADO:
        {{ $honora->delegado->pfildelegado->apaterno ?? 'N/A' }}
        {{ $honora->delegado->pfildelegado->amaterno ?? '' }}
        {{ $honora->delegado->pfildelegado->nombres ?? '' }}
    </p>

    @php
        $subtotal = 0;
    @endphp

    <table class="data-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>DISTRITO</th>
                <th>ADMINISTRADO</th>
                <th># EXPEDIENTE</th>
                <th># COMP.</th>
                <th>IMPORTE BRUTO</th>
                <th>N° INSP. PROGRAM</th>
                <th>COSTE X INSP.</th>
                <th>INSP. DEL MES</th>
                <th>MONTO BRUTO</th>
                <th>INSP. ANTERIORES</th>
                <th>SALDO DE INSP.</th>
            </tr>
        </thead>
        <tbody>
            @foreach($honoras as $item)
                @php
                    $insp_mes ?? 0;
                    $insp_past ?? 0;
                    $nrorev = $item->liquidacion->nrorev ?? 1;
                    $total = $item->liquidacion->total ?? 0;
                    $costoinsp = $nrorev > 0 ? $total / $nrorev : 0;
                    $insp_realizadas = $insp_mes + $insp_past;
                    $monto_bruto = $costoinsp * $insp_realizadas;
                    $subtotal += $monto_bruto;
                    $saldo_insp = $nrorev - $insp_realizadas
                @endphp
                <tr>
    <td>{{ $item->id_detalle_liquidacion ?? 'N/A' }}</td>
     <td>{{ $item->distrito->distrito ?? 'N/A' }}</td>
        <td>
            @if (!empty($item->liquidacion->personaJuridica))
                {{ $item->liquidacion->personaJuridica->razon }}
            @elseif (!empty($item->liquidacion->personaNatural))
                {{ $item->liquidacion->personaNatural->apaterno ?? '' }}
                {{ $item->liquidacion->personaNatural->amaterno ?? '' }}
                {{ $item->liquidacion->personaNatural->nombres ?? '' }}
            @else
                N/A
            @endif
        </td>
        <td>{{ $item->liquidacion->nroexpdte ?? '' }}</td>
        <td>{{ $item->liquidacion->nrocomp ?? '' }}</td>
        <td>{{ number_format($total, 2) }}</td>
        <td>{{ $nrorev }}</td>
        <td>{{ number_format($costoinsp, 2) }}</td>
        <td>{{ $insp_mes }}</td>
        <td>{{ number_format($monto_bruto, 2) }}</td>
        <td>{{ $insp_past }}</td>
        <td>{{ $saldo_insp ?? '0' }}</td>
    </tr>
            @endforeach
            @php
                $descuento = match (true) {
                    $subtotal <= 8000 => $subtotal * 0.15,
                    $subtotal <= 15000 => $subtotal * 0.20,
                    $subtotal <= 30000 => $subtotal * 0.30,
                    default => $subtotal * 0.40,
                };
                $honorario_total = $subtotal - $descuento;
            @endphp
            <tr class="totals">
                <td colspan="11" style="text-align: right;">SUBTOTAL S/:</td>
                <td>{{ number_format($subtotal, 2) }}</td>
            </tr>
            <tr class="totals">
                <td colspan="11" style="text-align: right;">DESCUENTO S/:</td>
                <td>{{ number_format($descuento, 2) }}</td>
            </tr>
            <tr class="totals">
                <td colspan="11" style="text-align: right;">HONORARIO TOTAL S/:</td>
                <td>{{ number_format($honorario_total, 2) }}</td>
            </tr>
        </tbody>
    </table>
</body>
</html>
