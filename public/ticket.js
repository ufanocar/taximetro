/********************************
 * CONFIGURACIÓN EMPRESA Y CLIENTE
 ********************************/

const EMPRESA_VTC = { nombre: "RadioTaxi", cif: "X12345678A", matricula: "1234XYZ" };
const CLIENTE = { nombre: "Cliente Ejemplo", documento: "00000000X" };

/********************************
 * UTILIDADES
 ********************************/

function fechaTicket(){
  const d = new Date();
  const dd = String(d.getDate()).padStart(2,"0");
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const yy = String(d.getFullYear()).slice(-2);
  const hh = String(d.getHours()).padStart(2,"0");
  const mi = String(d.getMinutes()).padStart(2,"0");
  return `${dd}${mm}${yy} ${hh}:${mi}`;
}

function fmt(n){
  return n.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2}) + " €";
}

/********************************
 * GENERAR TICKET
 ********************************/

function generarTicket(data){
  if(!data) return;

  const ticketHTML = `
  <div style="font-family:monospace;font-size:12px">
    <strong>${fechaTicket()}</strong><br><br>
    ${EMPRESA_VTC.nombre}<br>
    CIF: ${EMPRESA_VTC.cif}<br>
    Matrícula: ${EMPRESA_VTC.matricula}<br>
    ------------------------------<br>
    Cliente: ${CLIENTE.nombre}<br>
    Documento: ${CLIENTE.documento}<br>
    ------------------------------<br>
    Origen: ${data.loc.name}<br>
    Tarifa: Tarifa ${data.tarifaId}<br>
    Kilómetros: ${data.km.toFixed(2)} km<br>
    Espera: ${data.minutos} min<br>
    ------------------------------<br>
    Subtotal: ${fmt(data.subtotal)}<br>
    Mínimo aplicado: ${fmt(data.minimo)}<br>
    IVA (7%): ${fmt(data.iva)}<br>
    <strong>Total (IVA incluido): ${fmt(data.total)}</strong><br>
    ------------------------------<br>
    IVA incluido (7%)
  </div>
  `;

  const w = window.open("", "_blank", "width=320,height=540");
  w.document.write(ticketHTML);
  w.document.close();
  w.print();
}

/********************************
 * BOTÓN TICKET
 ********************************/

document.getElementById("ticketBtn").addEventListener("click", ()=>{
  if(typeof calcularServicio!=="function"){
    alert("Error: tarifas.js no cargado");
    return;
  }
  const data = calcularServicio();
  if(!data){
    alert("Seleccione origen");
    return;
  }
  generarTicket(data);
});
