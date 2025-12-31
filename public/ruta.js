/********************************
 * CONFIGURACIÓN EDITABLE
 ********************************/

Resultado
Localidad: Albalat dels Tarongers

Tarifa: Tarifa 1

Kilómetros: 0.00 km

Espera: 0 min

Subtotal: 8,75 €

Mínimo: 5,10 €

Total: 8,75 €

const LUGAR_CONTRATO = "Sagunto";
const DESTINO = "Elegido por cliente";

/********************************
 * UTILIDADES FECHA / HORA
 ********************************/

function formatoFecha(fecha) {
  return fecha.toLocaleDateString("es-ES");
}

function formatoHora(fecha) {
  return fecha.toLocaleTimeString("es-ES", {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/********************************
 * CARGAR DATOS DE RUTA
 ********************************/

document.addEventListener("DOMContentLoaded", () => {

  // Hora actual
  const ahora = new Date();

  // Hora inicio servicio = 15 min antes
  const inicioServicio = new Date(ahora.getTime() - 15 * 60000);

  // Origen desde localStorage (guardado en Takeus.html)
  const origen = localStorage.getItem("origenServicio") || "No indicado";

  /********************************
   * ASIGNACIÓN AL HTML
   ********************************/

  // Arrendador
  document.getElementById("empresaNombre").textContent = EMPRESA_VTC.nombre;
  document.getElementById("empresaCIF").textContent = EMPRESA_VTC.cif;

  // Cliente
  document.getElementById("clienteNombre").textContent = CLIENTE.nombre;
  document.getElementById("clienteDoc").textContent = CLIENTE.documento;

  // Contrato
  document.getElementById("lugarContrato").textContent = LUGAR_CONTRATO;
  document.getElementById("fechaContrato").textContent = formatoFecha(ahora);
  document.getElementById("horaContrato").textContent = formatoHora(inicioServicio);

  // Servicio
  document.getElementById("origenServicio").textContent = origen;
  document.getElementById("destinoServicio").textContent = DESTINO;
  document.getElementById("fechaInicio").textContent = formatoFecha(inicioServicio);
  document.getElementById("horaInicio").textContent = formatoHora(inicioServicio);
  document.getElementById("matricula").textContent = EMPRESA_VTC.matricula;
});
