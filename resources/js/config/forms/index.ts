// config/forms/index.ts
import { mascotaForm } from "./mascota.config"
import { clienteForm } from "./cliente.config"
import { citaForm } from "./cita.config"
import { especieForm } from "./especie.config"
import { historiaForm } from "./historia.config"
import { historia_seguimientoForm } from "./historia_seguimiento.config"
import { historia_valoracionForm } from "./historia_valoracion.config"
import { historia_productoForm } from "./historia_producto.config"
import { historia_producto_dosisForm } from "./historia_producto_dosis.config"
import { historia_procedimientoForm } from "./historia_procedimiento.config"
import { historia_anamnesisForm } from "./historia_anamnesis.config"
import { categoriaProcedimientoForm } from "./categoria_procedimiento.config"
import { categoriaProductoForm } from "./categoria_producto.config"
import { razaForm } from "./raza.config"
import { motivoForm } from "./motivo.config"
import { userForm } from "./user.config"    
import { productoForm } from "./producto.config"    
import { procedimientoForm } from "./procedimiento.config"  
import { miembroForm } from "./miembro.config"
export const FORM_CONFIG = {
  mascota: mascotaForm,
  cliente: clienteForm,
  cita: citaForm,
  categoria_procedimiento: categoriaProcedimientoForm,
  categoria_producto: categoriaProductoForm,
  especie: especieForm,
  historia: historiaForm,
  historia_seguimiento: historia_seguimientoForm,
  historia_valoracion: historia_valoracionForm,
  historia_producto: historia_productoForm,
  historia_producto_dosis: historia_producto_dosisForm,
  historia_procedimiento: historia_procedimientoForm,
  historia_anamnesis: historia_anamnesisForm,
  raza: razaForm, 
  motivo: motivoForm, 
  user: userForm, 
  producto: productoForm,
  procedimiento: procedimientoForm,
  miembro: miembroForm,
}