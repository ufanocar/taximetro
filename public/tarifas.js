/********************************
 * CONFIGURACIÓN DE TARIFAS
 ********************************/

const IVA_PORCENTAJE = 0.07;

const tarifas = {
  1: { flagfall: 2.15, perKm: 1.20, perHourWait: 20.87 }, // Tarifa 1
  2: { flagfall: 2.85, perKm: 1.44, perHourWait: 22.20 }, // Tarifa 2
  3: { flagfall: 2.25, perKm: 1.46, perHourWait: 19.00, perQuarterWait: 4.75 }, // Ordinaria
  4: { flagfall: 2.80, perKm: 1.68, perHourWait: 21.40, perQuarterWait: 5.35 }  // Especial
};

const minPercepcion = {
  diurno: 5.50,
  nocturno: 7.10
};

/********************************
 * LOCALIDADES Y COSTE DE RECOGIDA
 ********************************/

let localidades = [
  { name: "Sagunt / Sagunto", pickup: 5.00 },
  { name: "Canet d’en Berenguer", pickup: 5.00 },
  { name: "El Puig", pickup: 7.20 },
  { name: "Faura", pickup: 7.20 },
  { name: "Benifairó de les Valls", pickup: 7.20 },
  { name: "Quartell", pickup: 7.20 },
  { name: "Quart de les Valls", pickup: 7.20 },
  { name: "Benavites", pickup: 7.20 },
  { name: "Gilet", pickup: 7.20 },
  { name: "Petrés", pickup: 7.20 },
  { name: "Puçol", pickup: 7.20 },
  { name: "Estivella", pickup: 7.20 },
  { name: "Albalat dels Tarongers", pickup: 7.20 },
  { name: "Algímia d’Alfara", pickup: 10.35 },
  { name: "Alfara de la Baronia", pickup: 10.35 },
  { name: "Torres Torres", pickup: 10.35 },
  { name: "Segart", pickup: 10.35 },
  { name: "La Baronía Alta", pickup: 11.05 }
];

/********************************
 * UTILIDADES
 ********************************/

const $ = id => document.getElementById(id);

function fmt(n) {
  return n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

/********************************
 * CARGAR LOCALIDADES EN SELECT
 ********************************/

localidades.sort((a,b) => a.name.localeCompare(b.name, "es"));
const localidadSelect = $("localidad");

localidades.forEach((l,i)=>{
  const opt = document.createElement("option");
  opt.value = i;
  opt.textContent = l.name;
  localidadSelect.appendChild(opt);
});

/********************************
 * CÁLCULO DEL SERVICIO
 ********************************/

function calcularServicio() {
  if(localidadSelect.value==="") return null;

  const tarifaId = Number(document.querySelector("input[name='tarifa']:checked").value);
  const tarifa = tarifas[tarifaId];

  const km = parseFloat($("km").value) || 0;
  const minutos = parseInt($("minutos").value) || 0;
  const horario = document.querySelector("input[name='horario']:checked").value;
  const loc = localidades[localidadSelect.value];

  // Subtotal sin mínimo
  let subtotalSinMin = tarifa.flagfall + tarifa.perKm * km + tarifa.perHourWait * (minutos / 60) + loc.pickup;
  const minimo = minPercepcion[horario];
  const subtotal = Math.max(subtotalSinMin, minimo);

  // IVA desglosado
  const subtotalSinIVA = subtotal / (1 + IVA_PORCENTAJE);
  const iva = subtotal - subtotalSinIVA;

  const totalConIVA = subtotal;

  // Mostrar en pantalla
  $("factura").classList.remove("hidden");
  $("factLocalidad").textContent = loc.name;
  $("factTarifa").textContent = `Tarifa ${tarifaId}`;
  $("factKm").textContent = `${km.toFixed(2)} km`;
  $("factEspera").textContent = `${minutos} min`;
  $("factSubtotal").textContent = fmt(subtotalSinIVA);
  $("factMinimo").textContent = fmt(minimo);
  $("factIVA").textContent = fmt(iva);
  $("factTotal").textContent = fmt(totalConIVA);

  return { tarifaId, km, minutos, loc, subtotal: subtotalSinIVA, minimo, iva, total: totalConIVA };
}

/********************************
 * BOTONES
 ********************************/

$("rutaBtn").addEventListener("click",()=>{
  if(localidadSelect.value===""){
    alert("Seleccione origen");
    return;
  }
  localStorage.setItem("origenServicio", localidades[localidadSelect.value].name);
  window.location.href="ruta.html";
});

$("limpiarBtn").addEventListener("click",()=>{
  localidadSelect.value="";
  $("km").value=0;
  $("minutos").value=0;
  document.querySelector("input[name='tarifa'][value='1']").checked=true;
  document.querySelector("input[name='horario'][value='diurno']").checked=true;
  $("factura").classList.add("hidden");
});
