/********************************
 * CONFIGURACIÓN EMPRESA Y CLIENTE
 ********************************/
const EMPRESA_VTC = { 
  nombre: "RadioTaxi Sagunto", 
  cif: "X12345678A", 
  matricula: "1234XYZ", 
  direccion: "Av. Mediterráneo, Sagunto"
};

/********************************
 * UTILIDADES
 ********************************/

/**
 * Genera la fecha y hora actual
 */
function fechaTicket() {
  const d = new Date();
  const fecha = d.toLocaleDateString("es-ES", { day: '2-digit', month: '2-digit', year: 'numeric' });
  const hora = d.toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' });
  return `${fecha} ${hora}`;
}

/**
 * Formatea números a moneda Euro
 */
function fmt(n) {
  return Number(n).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

/********************************
 * GENERAR TICKET (VENTANA DE IMPRESIÓN)
 ********************************/

function generarTicket(data) {
  if (!data) return;

  const ticketHTML = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="utf-8">
    <style>
      body { 
        font-family: 'Courier New', Courier, monospace; 
        width: 280px; 
        margin: 20px auto; 
        color: #000; 
        font-size: 13px; 
        line-height: 1.4;
      }
      .text-center { text-align: center; }
      .text-right { text-align: right; }
      .font-bold { font-weight: bold; }
      .header { margin-bottom: 15px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
      .row { display: flex; justify-content: space-between; margin: 4px 0; }
      .divider { border-top: 1px dashed #000; margin: 10px 0; }
      .total { font-size: 16px; margin-top: 10px; border-top: 2px solid #000; padding-top: 5px; }
      .footer { margin-top: 25px; font-size: 11px; }
      .uppercase { text-transform: uppercase; }
      @media print { 
        body { margin: 0; width: 100%; } 
        .no-print { display: none; }
      }
    </style>
  </head>
  <body onload="window.print();">
    <div class="text-center header">
      <div class="font-bold" style="font-size: 16px;">${EMPRESA_VTC.nombre}</div>
      <div>CIF: ${EMPRESA_VTC.cif}</div>
      <div style="font-size: 10px;">${EMPRESA_VTC.direccion}</div>
      <div>MATRÍCULA: ${EMPRESA_VTC.matricula}</div>
    </div>

    <div>
      <div class="row"><span>FECHA:</span> <span>${fechaTicket()}</span></div>
      <div class="divider"></div>
      
      <div class="font-bold text-center uppercase" style="margin-bottom: 10px;">Ticket de Servicio</div>
      
      <div class="row"><span>ORIGEN:</span> <span class="font-bold text-right">${data.loc.name}</span></div>
      <div class="row"><span>TARIFA:</span> <span>T-${data.tarifaId}</span></div>
      <div class="row"><span>DISTANCIA:</span> <span>${Number(data.km).toFixed(2)} km</span></div>
      <div class="row"><span>ESPERA:</span> <span>${data.minutos} min</span></div>
      
      <div class="divider"></div>
      
      <div class="row"><span>BASE IMPONIBLE:</span> <span>${fmt(data.base)}</span></div>
      <div class="row"><span>IVA (10%):</span> <span>${fmt(data.iva)}</span></div>
      
      <div class="row total font-bold">
        <span>TOTAL:</span>
        <span>${fmt(data.total)}</span>
      </div>
      
      <div class="footer text-center">
        <div class="font-bold">¡GRACIAS POR SU CONFIANZA!</div>
        <div style="margin-top: 5px; font-style: italic;">Documento justificativo de pago.</div>
      </div>
    </div>
  </body>
  </html>
  `;

  // Abrir ventana de impresión
  const w = window.open("", "_blank", "width=400,height=600");
  w.document.write(ticketHTML);
  w.document.close();
}

/********************************
 * EVENTO BOTÓN TICKET
 ********************************/

document.getElementById("ticketBtn").addEventListener("click", () => {
  // 1. Forzamos el cálculo para obtener los datos más recientes
  if (typeof calcularServicio === "function") {
    const data = calcularServicio();
    
    if (!data) {
      alert("Por favor, rellene los datos y seleccione una localidad.");
      return;
    }

    // 2. Generamos el ticket con el desglose del IVA calculado
    generarTicket(data);
  } else {
    // Si calcularServicio no está disponible, intentamos leer de localStorage
    const storedData = localStorage.getItem("ultimoServicio");
    if (storedData) {
      generarTicket(JSON.parse(storedData));
    } else {
      alert("Error: No se han encontrado datos del servicio.");
    }
  }
});