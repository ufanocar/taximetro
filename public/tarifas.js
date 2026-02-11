/********************************
 * CONFIGURACIÓN Y TARIFAS
 ********************************/
const IVA_PORCENTAJE = 0.10; 

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

function inicializarLocalidades() {
    if (!localidadSelect) return;
    localidadSelect.innerHTML = '<option value="">-- Seleccionar origen --</option>';
    
    // Separamos "Sin recogida" y ordenamos el resto alfabéticamente
    const especial = localidades.find(l => l.especial);
    const pueblos = localidades.filter(l => !l.especial).sort((a,b) => a.name.localeCompare(b.name, "es"));

    [especial, ...pueblos].forEach((l) => {
        const opt = document.createElement("option");
        opt.value = localidades.indexOf(l);
        opt.textContent = l.name;
        localidadSelect.appendChild(opt);
    });
}

/********************************
 * LÓGICA DE CÁLCULO PRINCIPAL
 ********************************/
function calcularServicio() {
    const index = localidadSelect.value;
    if (index === "" || index === null) return null;

    const tarifaId = Number(document.querySelector("input[name='tarifa']:checked").value);
    const tarifa = tarifas[tarifaId];

    const km = parseFloat($("km").value) || 0;
    const minutos = parseInt($("minutos").value) || 0;
    const loc = localidades[index];

    let totalAcumulado = 0;

    // --- LÓGICA DE INICIO (BANDERA O RECOGIDA) ---
    // Si hay recogida (pueblos), se empieza con ese precio (IVA incluido, bandera incluida).
    // Si no hay recogida, se empieza con la bandera de la tarifa elegida.
    if (loc.pickup > 0) {
        totalAcumulado = loc.pickup; 
    } else {
        totalAcumulado = tarifa.flagfall;
    }

    // --- SUMA DE TRAYECTO Y ESPERA ---
    const precioKm = km * tarifa.perKm;
    const precioEspera = tarifa.perHourWait * (minutos / 60);
    
    totalAcumulado += precioKm + precioEspera;

    // --- APLICAR MÍNIMOS DE PERCEPCIÓN ---
    const horario = document.querySelector("input[name='horario']:checked").value;
    const minimoLegal = minPercepcion[horario];

    if (totalAcumulado < minimoLegal) {
        totalAcumulado = minimoLegal;
    }

    // --- DESGLOSE FINAL DEL IVA (Extracción) ---
    // Tomamos el total final y extraemos la base dividiendo por 1.10
    const baseImponible = totalAcumulado / 1.10;
    const cuotaIVA = totalAcumulado - baseImponible;

    // --- ACTUALIZAR INTERFAZ ---
    if ($("factura")) $("factura").classList.remove("hidden");
    if ($("placeholder")) $("placeholder").classList.add("hidden");

    $("factLocalidad").textContent = loc.name;
    $("factTarifa").textContent = `Tarifa ${tarifaId}`;
    $("factKm").textContent = `${km.toFixed(2)} km`;
    
    // Mostramos el desglose en el resumen
    $("factBase").textContent = fmt(baseImponible);
    $("factIVA").textContent = fmt(cuotaIVA);
    $("factTotal").textContent = fmt(totalAcumulado);

    // --- GUARDAR PARA OTROS MÓDULOS ---
    const data = { 
        tarifaId, 
        km, 
        minutos, 
        loc, 
        base: baseImponible.toFixed(2), 
        iva: cuotaIVA.toFixed(2), 
        total: totalAcumulado.toFixed(2) 
    };

    localStorage.setItem("ultimoServicio", JSON.stringify(data));
    localStorage.setItem("origenServicio", loc.name);

    return data;
}

/********************************
 * EVENTOS Y DISPARADORES
 ********************************/
localidadSelect.addEventListener("change", calcularServicio);

[$("km"), $("minutos")].forEach(el => {
    if (el) el.addEventListener('input', calcularServicio);
});

document.querySelectorAll("input[name='tarifa'], input[name='horario']").forEach(el => {
    el.addEventListener('change', calcularServicio);
});

if ($("limpiarBtn")) {
    $("limpiarBtn").addEventListener("click", () => {
        localidadSelect.value = "";
        $("km").value = "";
        $("minutos").value = "";
        document.querySelector("input[name='tarifa'][value='1']").checked = true;
        document.querySelector("input[name='horario'][value='diurno']").checked = true;
        
        if ($("factura")) $("factura").classList.add("hidden");
        if ($("placeholder")) $("placeholder").classList.remove("hidden");
        
        localStorage.clear();
    });
}

// Inicialización al cargar el script
inicializarLocalidades();