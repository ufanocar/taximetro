/********************************
 * CONFIGURACIÓN Y TARIFAS
 ********************************/
const IVA_PORCENTAJE = 0.10; // 10% (Ya incluido en los precios)

const tarifas = {
  1: { flagfall: 2.15, perKm: 1.20, perHourWait: 20.87 },
  2: { flagfall: 2.85, perKm: 1.44, perHourWait: 22.20 },
  3: { flagfall: 2.25, perKm: 1.46, perHourWait: 19.00 },
  4: { flagfall: 2.80, perKm: 1.68, perHourWait: 21.40 }
};

const minPercepcion = {
  diurno: 5.50,
  nocturno: 7.10
};

const localidades = [
  { name: "Sin recogida", pickup: 0, especial: true },
  { name: "Albalat dels Tarongers", pickup: 7.20 },
  { name: "Alfara de la Baronia", pickup: 11.05 },
  { name: "Algar de Palancia", pickup: 11.05 },
  { name: "Algimia d'Alfara", pickup: 11.05 },
  { name: "Benavites", pickup: 7.20 },
  { name: "Benifairo de les Valls", pickup: 7.20 },
  { name: "Canet d'en Berenguer", pickup: 5.00 },
  { name: "El Puig", pickup: 7.20 },
  { name: "Estivella", pickup: 7.20 },
  { name: "Faura", pickup: 7.20 },
  { name: "Gilet", pickup: 7.20 },
  { name: "Petres", pickup: 7.20 },
  { name: "Puzol", pickup: 7.20 },
  { name: "Quart de les Valls", pickup: 7.20 },
  { name: "Quartell", pickup: 7.20 },
  { name: "Sagunt / Sagunto", pickup: 5.00 },
  { name: "Segart", pickup: 11.05 },
  { name: "Torres Torres", pickup: 11.05 }
];

// Utilidades
const $ = id => document.getElementById(id);
function fmt(n) { 
  return n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €"; 
}

/********************************
 * CARGA DE LOCALIDADES
 ********************************/
const localidadSelect = $("localidad");
const especial = localidades.find(l => l.especial);
const pueblos = localidades.filter(l => !l.especial).sort((a,b) => a.name.localeCompare(b.name, "es"));

[especial, ...pueblos].forEach((l) => {
  const opt = document.createElement("option");
  opt.value = localidades.indexOf(l);
  opt.textContent = l.name;
  localidadSelect.appendChild(opt);
});

function gestionarEstadoHorario() {
  const locIndex = localidadSelect.value;
  // El horario solo es relevante para aplicar mínimos si no hay una recogida grande
  // o si se quiere forzar el mínimo diurno/nocturno.
  const radios = document.querySelectorAll("input[name='horario']");
  radios.forEach(r => {
    const parent = r.closest('label');
    if (parent) {
      parent.style.opacity = "1";
      parent.style.cursor = "pointer";
    }
  });
}

/********************************
 * LÓGICA DE CÁLCULO PRINCIPAL
 ********************************/
function calcularServicio() {
  const index = localidadSelect.value;
  if(index === "") return null;

  const tarifaId = Number(document.querySelector("input[name='tarifa']:checked").value);
  const tarifa = tarifas[tarifaId];

  const km = parseFloat($("km").value) || 0;
  const minutos = parseInt($("minutos").value) || 0;
  const loc = localidades[index];

  // 1. Cálculo del precio real según taxímetro
  const espera = tarifa.perHourWait * (minutos / 60);
  let totalCalculado = tarifa.flagfall + loc.pickup + (km * tarifa.perKm) + espera;

  // 2. Aplicar Mínimo de Percepción
  // Si el total calculado es menor que el mínimo de la franja, se cobra el mínimo.
  const horario = document.querySelector("input[name='horario']:checked").value;
  const minimoLegal = minPercepcion[horario];

  if (totalCalculado < minimoLegal) {
    totalCalculado = minimoLegal;
  }

  // 3. DESGLOSE DEL IVA (Extracción del 10%)
  // Fórmula: Base = Total / 1.10 | IVA = Total - Base
  const base = totalCalculado / (1 + IVA_PORCENTAJE);
  const iva = totalCalculado - base;

  // 4. Actualizar Interfaz
  if ($("factura")) $("factura").classList.remove("hidden");
  if ($("placeholder")) $("placeholder").classList.add("hidden");

  $("factLocalidad").textContent = loc.name;
  $("factTarifa").textContent = `Tarifa ${tarifaId}`;
  $("factKm").textContent = `${km.toFixed(2)} km`;
  
  $("factBase").textContent = fmt(base);
  $("factIVA").textContent = fmt(iva);
  $("factTotal").textContent = fmt(totalCalculado);

  // 5. Guardar para Ticket y Hoja de Ruta
  const data = { 
    tarifaId, 
    km, 
    minutos, 
    loc, 
    base: base.toFixed(2), 
    iva: iva.toFixed(2), 
    total: totalCalculado.toFixed(2) 
  };

  localStorage.setItem("ultimoServicio", JSON.stringify(data));
  localStorage.setItem("origenServicio", loc.name);

  return data;
}

/********************************
 * EVENTOS
 ********************************/
localidadSelect.addEventListener("change", () => {
  gestionarEstadoHorario();
  calcularServicio();
});

[$("km"), $("minutos")].forEach(el => {
  el.addEventListener('input', calcularServicio);
});

document.querySelectorAll("input[name='tarifa'], input[name='horario']").forEach(el => {
  el.addEventListener('change', calcularServicio);
});

$("limpiarBtn").addEventListener("click", ()=>{
  localidadSelect.value = "";
  $("km").value = "";
  $("minutos").value = "";
  document.querySelector("input[name='tarifa'][value='1']").checked = true;
  document.querySelector("input[name='horario'][value='diurno']").checked = true;
  
  if($("factura")) $("factura").classList.add("hidden");
  if($("placeholder")) $("placeholder").classList.remove("hidden");
  
  localStorage.clear();
  gestionarEstadoHorario();
});

// Inicialización
gestionarEstadoHorario();