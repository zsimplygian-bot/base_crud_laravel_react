from flask import Flask, request, jsonify
import pandas as pd
import joblib
from datetime import datetime

try:
    from tabulate import tabulate
except ImportError:
    tabulate = None

app = Flask(__name__)

# 1. CARGA DEL MODELO
try:
    modelo = joblib.load('modelo_rfm.joblib')
    cols_modelo = ['Recencia', 'Frecuencia', 'Valor_Monetario', 'Dias_Desde_Registro', 'Ticket_Promedio', 'Intervalo_Visitas']
    print("✅ SERVIDOR IA: Proyectando a fecha fija 2026-12-31.")
except Exception as e:
    print(f"❌ ERROR CARGA MODELO: {e}")

@app.route('/predict_rfm', methods=['POST'])
def predict():
    try:
        items = request.get_json()
        if not isinstance(items, list): items = [items]
        
        # Configuración de fechas
        fecha_actual = datetime.now()
        fecha_destino = datetime(2026, 7, 31)
        dias_totales = (fecha_destino - fecha_actual).days
        
        if dias_totales < 0:
            return jsonify({'status': 'error', 'message': 'La fecha actual es posterior al 2026-12-31'}), 400

        resultados = []
        filas_log = []

        for cliente in items:
            # --- DATOS DE ENTRADA (Singular) ---
            id_c = cliente.get('id_cliente')
            r = float(cliente.get('recencia', 0))
            f = float(cliente.get('frecuencia', 0))
            m = float(cliente.get('valor_monetario', 0))
            a = float(cliente.get('antiguedad', 0))
            
            # --- INGENIERÍA DE VARIABLES (Individual) ---
            tp = m / f if f > 0 else 0
            iv = a / f if f > 0 else a
            
            # Creación de DataFrame para el modelo
            df_input = pd.DataFrame([[r, f, m, a, tp, iv]], columns=cols_modelo)
            
            # --- PREDICCIÓN DE TASAS ---
            # pred = [tasa_visitas_diaria, tasa_gasto_diario, recencia_proyectada]
            pred = modelo.predict(df_input)[0]
            
            tasa_f = pred[0]
            tasa_m = pred[1]
            r_pred = float(pred[2]) # Recencia proyectada según el modelo

            # --- LÓGICA INCREMENTAL A FECHA FIJA ---
            # Frecuencia Proyectada = Frecuencia Actual + (Tasa * Días faltantes)
            f_proy = f + (tasa_f * dias_totales)
            # Valor Monetario Proyectado = Monetario Actual + (Tasa * Días faltantes)
            m_proy = m + (tasa_m * dias_totales)

            # --- GUARDAR RESULTADOS ---
            resultados.append({
                'id_cliente': id_c,
                'recencia_p': r_pred,
                'frecuencia_p': f_proy,
                'valor_monetario_p': m_proy
            })

            # --- FILA PARA LOG DE CONSOLA ---
            filas_log.append({
                'ID_Cli': id_c,
                'R_Act': r, 'F_Act': f, 'M_Act': m, 'Antig': a,
                '|': '→',
                'Días': dias_totales,
                'R_Pred': round(r_pred, 1),
                'F_Pred': round(f_proy, 2),
                'M_Pred': round(m_proy, 2)
            })

        # --- IMPRESIÓN ORDENADA EN CONSOLA ---
        print("\n" + "═"*110)
        print(f"📊 PROYECCIÓN RFM AL 2026-12-31 (Horizonte: {dias_totales} días)")
        print("═"*110)
        
        df_visual = pd.DataFrame(filas_log)
        if tabulate:
            print(tabulate(df_visual, headers='keys', tablefmt='psql', showindex=False))
        else:
            print(df_visual.to_string(index=False))
        print("═"*110 + "\n")

        return jsonify({'status': 'success', 'predicciones': resultados})

    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 400

if __name__ == '__main__':
    app.run(port=5000, debug=True)