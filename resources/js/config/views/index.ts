// config/views/index.ts
import { mascotaView } from "./mascota.config"
import { clienteView } from "./cliente.config"
import { citaView } from "./cita.config"
import { especieView } from "./especie.config"
import { historiaView } from "./historia.config"
import { historia_seguimientoView } from "./historia_seguimiento.config"
import { historia_valoracionView } from "./historia_valoracion.config"
import { historia_productoView } from "./historia_producto.config"
import { historia_producto_dosisView } from "./historia_producto_dosis.config"
import { historia_procedimientoView } from "./historia_procedimiento.config"
import { historia_anamnesisView } from "./historia_anamnesis.config"
import { categoriaProcedimientoView } from "./categoria_procedimiento.config"
import { categoriaProductoView } from "./categoria_producto.config"
import { razaView } from "./raza.config"
import { motivoView } from "./motivo.config"
import { userView } from "./user.config"    
import { productoView } from "./producto.config"    
import { procedimientoView } from "./procedimiento.config"  
import { miembroView } from "./miembro.config"
import { clvView } from "./clv.config"
import { churnView } from "./churn.config"
import { npsView } from "./nps.config"
export const VIEW_CONFIG = {
  mascota: mascotaView,
  cliente: clienteView,
  cita: citaView,
  categoria_procedimiento: categoriaProcedimientoView,
  categoria_producto: categoriaProductoView,
  especie: especieView,
  historia: historiaView,
  historia_seguimiento: historia_seguimientoView,
  historia_valoracion: historia_valoracionView,
  historia_producto: historia_productoView,
  historia_producto_dosis: historia_producto_dosisView,
  historia_procedimiento: historia_procedimientoView,
  historia_anamnesis: historia_anamnesisView,
  raza: razaView, 
  motivo: motivoView, 
  user: userView, 
  producto: productoView,
  procedimiento: procedimientoView,
  miembro: miembroView,
  clv: clvView,
  churn: churnView,
  nps: npsView,
}