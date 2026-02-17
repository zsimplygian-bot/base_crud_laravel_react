// config/forms/index.ts
import { mascotaForm } from "./mascota.config"
import { clienteForm } from "./cliente.config"
import { citaForm } from "./cita.config"
import { especieForm } from "./especie.config"
import { historia_clinicaForm } from "./historia_clinica.config"
import { categoriaProcedimientoForm } from "./categoria_procedimiento.config"
import { categoriaProductoForm } from "./categoria_producto.config"
import { razaForm } from "./raza.config"
import { motivoForm } from "./motivo.config"
import { userForm } from "./user.config"    
import { productoForm } from "./producto.config"    
import { procedimientoForm } from "./procedimiento.config"  
export const FORM_CONFIG = {
  mascota: mascotaForm,
  cliente: clienteForm,
  cita: citaForm,
  categoriaProcedimiento: categoriaProcedimientoForm,
  categoriaProducto: categoriaProductoForm,
  especie: especieForm,
  historia_clinica: historia_clinicaForm,
  raza: razaForm, 
  motivo: motivoForm, 
  user: userForm, 
  producto: productoForm,
  procedimiento: procedimientoForm,
}