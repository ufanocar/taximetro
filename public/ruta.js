/********************************
 * CONFIGURACIÓN VTC (Sincronizada)
 ********************************/
const EMPRESA_VTC = { 
  nombre: "Mare Nostrum Movile", 
  cif: "B12345678A", 
  matricula: "1234ABCD" 
};

const CLIENTE = { 
  nombre: "RadioTaxi Sagunto", 
  documento: "X12345678A", 
};

const LUGAR_CONTRATO = "Sagunto";
const DESTINO = "Elegido por el cliente";

/********************************
 * UTILIDADES FECHA / HORA
 ********************************/
const fmtF = (f) => f.toLocaleDateString("es-ES", { day: '2-digit', month: '2-digit', year: 'numeric' });
const fmtH = (f) => f.toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' });

/********************************
 * CARGAR DATOS DE RUTA
 ********************************/
function cargarHoja() {
  const ahora = new Date();
  
  // HORA CONTRATO: 15 minutos antes de la hora actual del PC
  const contratoServicio = new Date(ahora.getTime() - 15 * 60000);

  // Recuperar origen desde localStorage
  const origen = localStorage.getItem("origenServicio") || "No especificado";

  // Función para escribir en el HTML si el ID existe
  const set = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  // Asignación de datos Arrendador y Cliente
  set("headerEmpresa", EMPRESA_VTC.nombre);
  set("empresaNombre", EMPRESA_VTC.nombre);
  set("empresaCIF", EMPRESA_VTC.cif);
  set("matricula", EMPRESA_VTC.matricula);
  set("clienteNombre", CLIENTE.nombre);
  set("clienteDoc", CLIENTE.documento);

  // Datos del Contrato (Lugar, Fecha, Hora -15 min)
  set("lugarContrato", LUGAR_CONTRATO);
  set("fechaContrato", fmtF(contratoServicio));
  set("horaContrato", fmtH(contratoServicio));

  // Datos del Servicio (Itinerario)
  set("origenServicio", origen);
  set("destinoServicio", DESTINO);
  
  // Opcionales si existen en el HTML
  set("fechaInicio", fmtF(ahora));
  set("horaInicio", fmtH(ahora));
}

// Ejecutar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", cargarHoja);
// Por seguridad en carga local:
window.onload = cargarHoja;