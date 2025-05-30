// === VARIABILI GLOBALI ===
let pin = "";
let utenti = [];

// === FUNZIONI PER index.html (Timbrature) ===

async function caricaUtenti() {
  const response = await fetch("utenti.html");
  const text = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");
  const righe = doc.querySelectorAll("table tr");

  utenti = [];
  righe.forEach((riga, index) => {
    if (index === 0) return; // salta intestazione
    const celle = riga.querySelectorAll("td");
    if (celle.length >= 3) {
      utenti.push({
        nome: celle[0].textContent.trim(),
        cognome: celle[1].textContent.trim(),
        pin: celle[2].textContent.trim()
      });
    }
  });
}

function aggiornaDisplayPin() {
  const display = document.getElementById("display");
  if (display) display.textContent = pin;
}

function aggiungiNumero(numero) {
  if (pin.length < 2) {
    pin += numero;
    aggiornaDisplayPin();
  }
}

function cancella() {
  pin = "";
  aggiornaDisplayPin();
}

function registraTimbratura(tipo) {
  const utente = utenti.find(u => u.pin === pin);
  const ora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!utente) {
    document.getElementById("confirma").textContent = "PIN non valido";
    document.getElementById("confirma").style.background = "#dc3545";
  } else {
    document.getElementById("confirma").textContent = `${utente.nome.toUpperCase()} ha timbrato: ${tipo} alle ${ora}`;
    document.getElementById("confirma").style.background = "#ccc";
    document.getElementById("ultima").textContent = `Ultima timbratura: ${tipo} ${ora}`;
  }

  pin = "";
  aggiornaDisplayPin();
}

// === FUNZIONI PER storico.html ===

document.addEventListener("DOMContentLoaded", () => {
  const pinParam = new URLSearchParams(window.location.search).get("pin");
  const nomeEl = document.getElementById("nomeUtente");
  const tbody = document.getElementById("tabellaTimbrature");
  const totaleOreSpan = document.getElementById("totaleOre");

  if (!pinParam || !tbody || !nomeEl) return; // siamo su un'altra pagina

  // Simulazione dati (da sostituire con fetch Supabase)
  const timbrature = [
    { data: "2025-05-02", entrata: "08:15", uscita: "17:00" },
    { data: "2025-05-05", entrata: "08:10", uscita: "16:45" }
  ];

  const nomeUtente = "Mario Rossi"; // da Supabase
  nomeEl.textContent = nomeUtente;

  const year = 2025;
  const month = 4; // 0-based (4 = maggio)
  const giorniSettimana = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
  const giorniNelMese = new Date(year, month + 1, 0).getDate();

  let totaleMinuti = 0;

  for (let giorno = 1; giorno <= giorniNelMese; giorno++) {
    const data = new Date(year, month, giorno);
    const dataStr = data.toISOString().split("T")[0];
    const giornoSettimana = giorniSettimana[data.getDay()];
    const riga = timbrature.find(t => t.data === dataStr);

    let entrata = riga?.entrata || "—";
    let uscita = riga?.uscita || "—";
    let ore = 0;

    if (riga?.entrata && riga?.uscita) {
      const [hIn, mIn] = riga.entrata.split(":").map(Number);
      const [hOut, mOut] = riga.uscita.split(":").map(Number);
      const minuti = (hOut * 60 + mOut) - (hIn * 60 + mIn);
      ore = Math.floor(minuti / 60);
      totaleMinuti += minuti;
    }

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${giornoSettimana} ${giorno}</td>
      <td>${entrata}</td>
      <td>${uscita}</td>
      <td>${ore}</td>
    `;
    tbody.appendChild(row);
  }

  const totOre = Math.floor(totaleMinuti / 60);
  const totMin = totaleMinuti % 60;
  totaleOreSpan.textContent = `${totOre} ore e ${totMin} min`;
});

// === EXPORT EXCEL ===
function esportaExcel() {
  const table = document.querySelector("table");
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.table_to_sheet(table);
  XLSX.utils.book_append_sheet(wb, ws, "Storico");
  XLSX.writeFile(wb, "storico_timbrature.xlsx");
}

// === INVIO EMAIL ===
function inviaEmail() {
  const utente = document.getElementById("nomeUtente")?.textContent || "Dipendente";
  const corpo = document.querySelector("table")?.outerHTML || "";

  emailjs.send("default_service", "template_storico", {
    nome_utente: utente,
    messaggio_html: corpo
  }).then(() => {
    alert("Email inviata con successo!");
  }, (error) => {
    alert("Errore invio email: " + error.text);
  });
}

