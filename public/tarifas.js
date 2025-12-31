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

const localidades = [
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
  { name: "Algímia d’Alfara", pickup: 11.05 },
  { name: "Alfara de la Baronia", pickup: 11.05 },
  { name: "Torres Torres", pickup: 11.05 },
  { name: "Segart", pickup: 11.05 },
  { name: "La Baronía Alta", pickup: 11.05 }
];

// Utilidades
const $ = id => document.getElementById(id);
function fmt(n) { return n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €"; }

// Cargar localidades en select (ordenadas alfabéticamente)
const localidadSelect = $("localidad");
localidades.sort((a,b) => a.name.localeCompare(b.name, "es")).forEach((l,i)=>{
  const opt = document.createElement("option");
  opt.value = i;
  opt.textContent = l.name;
  localidadSelect.appendChild(opt);
});

/**
 * Lógica principal de cálculo
 */
function calcularServicio() {
  const index = localidadSelect.value;
  if(index === "") return null;

  const tarifaId = Number(document.querySelector("input[name='tarifa']:checked").value);
  const tarifa = tarifas[tarifaId];

  const km = parseFloat($("km").value) || 0;
  const minutos = parseInt($("minutos").value) || 0;
  const horario = document.querySelector("input[name='horario']:checked").value;
  const loc = localidades[index];

  // 1. Cálculo de Espera
  let espera = 0;
  if(tarifa.perQuarterWait){ 
    // Tarifas 3 y 4: fracciones de 15 min (si hay 1 min, ya cuenta como una fracción)
    const fracciones = Math.ceil(minutos / 15);
    espera = fracciones * tarifa.perQuarterWait;
  } else {
    // Tarifas 1 y 2: Proporcional por hora
    espera = tarifa.perHourWait * (minutos / 60);
  }

  // 2. Cálculo del Bruto (IVA incluido)
  let totalConIVA = tarifa.flagfall + loc.pickup + (km * tarifa.perKm) + espera;

  // 3. Aplicar Mínimo de Percepción
  const minimo = minPercepcion[horario];
  if(totalConIVA < minimo) {
      totalConIVA = minimo;
  }

  // 4. Desglose de Base e IVA (7%)
  // Fórmula: Base = Total / (1 + 0.07)
  const base = totalConIVA / (1 + IVA_PORCENTAJE);
  const iva = totalConIVA - base;

  // 5. Mostrar en pantalla (index.html)
  const factDiv = $("factura");
  const placeholder = $("placeholder");
  
  if (factDiv && placeholder) {
      factDiv.classList.remove("hidden");
      placeholder.classList.add("hidden");
  }

  $("factLocalidad").textContent = loc.name;
  $("factTarifa").textContent = `Tarifa ${tarifaId}`;
  $("factKm").textContent = `${km.toFixed(2)} km`;
  $("factBase").textContent = fmt(base);
  $("factIVA").textContent = fmt(iva);
  $("factTotal").textContent = fmt(totalConIVA);

  // 6. Guardar en localStorage para la Hoja de Ruta (ruta.html)
  localStorage.setItem("origenServicio", loc.name);

  return { 
      tarifaId, 
      km, 
      minutos, 
      loc, 
      base: +base.toFixed(2), 
      iva: +iva.toFixed(2), 
      total: +totalConIVA.toFixed(2) 
  };
}

// Botón limpiar
$("limpiarBtn").addEventListener("click", ()=>{
  localidadSelect.value = "";
  $("km").value = "";
  $("minutos").value = "";
  document.querySelector("input[name='tarifa'][value='1']").checked = true;
  document.querySelector("input[name='horario'][value='diurno']").checked = true;
  
  if($("factura")) $("factura").classList.add("hidden");
  if($("placeholder")) $("placeholder").classList.remove("hidden");
  
  localStorage.removeItem("origenServicio");
});

// Escuchar cambios para cálculo automático (opcional, pero mejora UX)
[localidadSelect, $("km"), $("minutos")].forEach(el => {
    el.addEventListener('input', calcularServicio);
});
document.querySelectorAll("input[name='tarifa'], input[name='horario']").forEach(el => {
    el.addEventListener('change', calcularServicio);
});