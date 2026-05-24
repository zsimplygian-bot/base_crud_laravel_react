from flask import Flask, request, jsonify
import pandas as pd
import joblib
from datetime import datetime
import threading
import time

app = Flask(__name__)

# 1. CARGA DE MODELO
try:
    modelo = joblib.load('modelo_rfm.joblib')
    cols_ia = ['Recencia', 'Frecuencia', 'Valor_Monetario', 'Dias_Desde_Registro', 'Ticket_Promedio', 'Intervalo_Visitas']
    print("✅ Modelo cargado correctamente.")
except Exception as e:
    print(f"❌ Error al cargar modelo: {e}")

# 2. LÓGICA DE CÁLCULO
def procesar_ia(r, f, m, a, dias_h):
    # Ingeniería de variables rápida
    tp = m / f if f > 0 else 0
    iv = a / f if f > 0 else a
    
    df = pd.DataFrame([[r, f, m, a, tp, iv]], columns=cols_ia)
    pred = modelo.predict(df)[0]
    
    return {
        'recencia_p': float(pred[2]),
        'frecuencia_p': float(f + (pred[0] * dias_h)),
        'valor_monetario_p': float(m + (pred[1] * dias_h))
    }

# 3. RUTA API PARA LARAVEL
@app.route('/predict_rfm', methods=['POST'])
def predict():
    data = request.get_json()
    # Para la API usamos 30 días por defecto o calculamos según fecha si la envías
    h = 30 
    if isinstance(data, list):
        return jsonify({'status': 'success', 'predicciones': [procesar_ia(i['recencia'], i['frecuencia'], i['valor_monetario'], i['antiguedad'], h) for i in data]})
    return jsonify({'status': 'success', 'prediccion': procesar_ia(data['recencia'], data['frecuencia'], data['valor_monetario'], data['antiguedad'], h)})

# 4. MODO CONSOLA INTERACTIVO
def menu_manual():
    time.sleep(2) # Espera a que Flask inicie
    while True:
        print("\n" + "="*40)
        print("🧪 PRUEBA MANUAL DE PREDICCIÓN")
        print("="*40)
        try:
            r = float(input("Recencia (días): "))
            f = float(input("Frecuencia (visitas): "))
            m = float(input("Valor Monetario (S/): "))
            a = float(input("Antigüedad (días): "))
            
            f_actual = input("Fecha Actual (AAAA-MM-DD) [Enter = Hoy]: ")
            f_actual = pd.to_datetime(f_actual) if f_actual else pd.Timestamp.now().normalize()
            
            f_proy = input("Fecha Proyectada (AAAA-MM-DD): ")
            f_proy = pd.to_datetime(f_proy)
            
            dias_h = (f_proy - f_actual).days
            
            if dias_h <= 0:
                print("❌ La fecha proyectada debe ser mayor a la actual.")
                continue

            res = procesar_ia(r, f, m, a, dias_h)
            
            print("\n📈 RESULTADO DE PROYECCIÓN:")
            print(f" > Horizonte: {dias_h} días")
            print(f" > Recencia Proyectada: {res['recencia_p']:.1f} días")
            print(f" > Frecuencia Total:   {res['frecuencia_p']:.2f} visitas")
            print(f" > Valor Monetario:    S/ {res['valor_monetario_p']:.2f}")
            
        except Exception as e:
            print(f"❌ Error en datos: {e}")
        
        opc = input("\n¿Deseas probar otro? (s/n): ")
        if opc.lower() != 's': break

# 5. EJECUCIÓN DUAL
if __name__ == '__main__':
    # Hilo para que el input no bloquee a Flask
    threading.Thread(target=menu_manual, daemon=True).start()
    app.run(port=5000)