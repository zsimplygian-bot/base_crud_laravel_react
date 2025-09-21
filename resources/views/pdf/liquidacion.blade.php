<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>Liquidación PDF</title>
    
    <style>
        @page {
            margin: 5mm;
        }
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            margin: 0;
            padding: 0;
            border: 2px solid black;
            width: 287mm;
            height: 202mm;
            box-sizing: border-box;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            font-size: 11px;
        }
        td {
            vertical-align: top;
            padding: 3px 5px;
        }
        /* Header tabla */
        .header-table td:nth-child(1) {
            width: 15%;
            padding-left: 20px;
            padding-top: 15px;
        }
        .header-table td:nth-child(2) {
            width: 50%;
            padding-left: 10px;
            font-size: 20px;
            line-height: 1;
            text-align: left;
        }
        .header-table td:nth-child(3) {
            width: 35%;
            text-align: center;
            font-size: 13px;
            vertical-align: middle;
            padding-top: 10px;
            font-weight: bold;
            text-decoration: underline;
        }
        .header-table td:nth-child(3) p {
            margin: 5px 0 0 0;
            font-weight: normal;
            text-decoration: none;
        }

        /* Título principal */
        .titulo-principal {
            font-size: 15px;
            text-align: left;
            padding-left: 20px;
            font-weight: bold;
            margin-top: 15px;
            margin-bottom: 0;
        }

        /* Tabla info principal */
        .info-table {
            margin-left: 15px;
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }
        .info-table td.left {
            width: 35%;
            text-align: left; /* aquí la alineación a la izquierda */
            font-weight: bold;
            padding-right: 10px;
            line-height: 1.3; /* buen espaciado vertical */
        }
        .info-table td.right {
            width: 35%;
            text-align: left;
            padding-left: 10px;
            line-height: 1.3;
        }
        .info-table td.spacer {
            width: 5%;
        }
        .info-table td.left-numbers {
            width: 12.5%;
            text-align: left;
            font-weight: bold;
            line-height: 1.3;
        }
        .info-table td.right-numbers {
            width: 12.5%;
            text-align: left;
            line-height: 1.3;
        }

        /* Footer tabla */
        .footer-table td {
            font-size: 10px;
            text-align: center;
        }
        .footer-table td.left-title {
            font-weight: bold;
            font-size: 13px;
            text-align: left;
        }
        .footer-table td.left-label {
            font-size: 13px;
            font-weight: bold;
            text-align: left;
            vertical-align: top;
            width: 20%;
        }
        .footer-table td.left-value {
            font-size: 13px;
            text-align: left;
            vertical-align: top;
            width: 60%;
        }
        .footer-table td.total {
            font-size: 16px;
            font-weight: bold;
            text-align: left;
        }
        .footer-table td.warning {
            font-size: 25px;
            font-weight: bold;
            text-align: left;
        }
    </style>
</head>
<body>
<table class="header-table" border="0" style="width: 100%;">
    <tr>
        <td>
            <img src="{{ public_path('logo.png') }}" width="100" height="100" alt="Logo" />
        </td>
        <td>
            <br />
            <span style="font-weight: bold; display: block; margin: 0;">COLEGIO DE INGENIEROS DEL PERÚ</span>
            <span style="font-weight: normal; display: block; margin: 0;">CONSEJO DEPARTAMENTAL DE LIMA</span>
            <span style="font-weight: normal; display: block; margin: 0;">COMISIÓN DE ASUNTOS MUNICIPALES</span>
        </td>
        <td>
            <b><u>IMPORTANTE: ESTA LIQUIDACIÓN DEBERÁ ADJUNTARLA AL COMPROBANTE DE PAGO</u></b>
        </td>
    </tr>
</table>
<p class="titulo-principal">
    LIQUIDACIÓN DE DERECHOS POR {{ $liquidacion->tipoLiquid->tipo_liquid ?? 'N/A' }}
</p>
<table class="info-table" border="0">
    <tr>
        <td class="left">
            @if($liquidacion->id_persona_j)
                <p>RUC:</p>
                <p>RAZÓN SOCIAL:</p>
            @else
                <p>DOCUMENTO:</p>
                <p>PERSONA:</p>
            @endif
            <p>NOMBRE DE PROYECTO:</p>
            <p>PROPIETARIO:</p>
            <p>DPTO. / DISTRITO:</p>
            <p>DIRECCIÓN DE LA OBRA:</p>
            <p>{{ empty($liquidacion->urbanizacion) ? 'ESPECIALIDAD OBSERVADA:' : 'URBANIZACIÓN:' }}</p>
            <p>PROYECTISTA:</p>
            <p>VALOR DE LA OBRA DECLARADO S/.</p>
            <p style="margin-bottom: 0; line-height: 1.0;">
                % A APLICAR SOBRE EL VALOR DE LA OBRA:<br>
                <span style="font-weight: normal; margin: 0; padding: 0;">Derecho Mínimo 2% de la UIT + IGV</span>
            </p>
        </td>
        <td class="right">
            @if($liquidacion->id_persona_j)
                <p>{{ optional($liquidacion->personaJuridica)->ruc ?? 'N/A' }}</p>
                <p>{{ optional($liquidacion->personaJuridica)->razon ?? 'N/A' }}</p>
            @else
                <p>{{ $liquidacion->personaNatural->docu->docu }}</p>
                <p>
                    {{ optional($liquidacion->personaNatural)->apaterno ?? '' }}
                    {{ optional($liquidacion->personaNatural)->amaterno ?? '' }}
                    {{ optional($liquidacion->personaNatural)->nombres ?? '' }}
                </p>
            @endif
            <p>{{ $liquidacion->proyecto ?? 'N/A' }}</p>
            @if($liquidacion->id_propietario_j)
                <p>{{ optional($liquidacion->personaJuridica)->razon ?? 'N/A' }}</p>
            @else       
                <p>{{ optional($liquidacion->propietarioNatural)->apaterno ?? '' }}
                    {{ optional($liquidacion->propietarioNatural)->amaterno ?? '' }}
                    {{ optional($liquidacion->propietarioNatural)->nombres ?? '' }}</p>
            @endif
            <p>{{ optional($liquidacion->distrito)->distrito ?? 'N/A' }}</p>
            <p>{{ $liquidacion->direccion ?? 'N/A' }}</p>
            <p>{{ $liquidacion->urbanizacion ?? $liquidacion->especialidad->especialidad ?? 'N/A' }}</p>
            <p>{{ $liquidacion->proyectista ?? 'N/A' }}</p>
            <p>{{ number_format($liquidacion->valor ?? 0, 2) }}</p>
            <p>{{ number_format($liquidacion->porcenaplica ?? 0, 2) }}</p>
        </td>
        <td class="spacer"></td>
        <td class="left-numbers">
            <p><b>ID:</b></p>
            </b></p></b></p></b></p></b></p></b></p>
            <p><b>SUBTOTAL S/.</b></p>
            <p><b>I.G.V. S/.</b></p>
            <p><b>TOTAL S/.</b></p>
        </td>
        <td class="right-numbers">
            <p>{{ $liquidacion->id_liquidacion ?? 'N/A' }}</p>
            </b></p></b></p></b></p></b></p></b></p>
            <p>{{ number_format($liquidacion->subtotal ?? 0, 2) }}</p>
            <p>{{ number_format($liquidacion->igv ?? 0, 2) }}</p>
            <p>{{ number_format($liquidacion->total ?? 0, 2) }}</p>
        </td>
    </tr>
</table>
<table border="0" style="width: 100%; margin-top: 20px; margin-left: 10px;">
    <tr>
        <td style="width: 50%; vertical-align: top;">
            <table class="footer-table" border="0" style="width: 100%;">
                <thead>
                    <tr>
                        <td colspan="2" class="left-title">
                            COMISIÓN DE ASUNTOS MUNICIPALES
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="left-label">
                            <p>TEL:</p>
                            <p>TRAMITADOR:</p>
                            <p>TELÉFONO:</p>
                            <p>FECHA:</p>
                        </td>
                        <td class="left-value">
                            <p>202-5066</p>
                            <p>{{ explode(' ', $liquidacion->tramitador->nombres ?? '')[0] ?? '' }}</p>
                            <p>123</p>
                            <p>{{ $liquidacion->created_at ?? '' }}</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </td>
        <td style="width: 50%; vertical-align: top;">
            <table class="footer-table" border="0" style="width: 100%;">
                <thead>
                    <tr>
                        <td class="total">
                            TOTAL A PAGAR S/. {{ number_format($liquidacion->total ?? 0, 2) }}
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="warning">
                            ESTE DOCUMENTO NO ES COMPROBANTE DE PAGO
                        </td>
                    </tr>
                </tbody>
            </table>
        </td>
    </tr>
</table>
</body>
</html>