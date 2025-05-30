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
    if (index === 0) return;
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
    document.getElementById("confirma").textContent = `${utente.nome.toUpperCase()} ha timbrato: ${tipo}`;
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

  if (!pinParam || !tbody || !nomeEl) return;

  const DateTime = luxon.DateTime;
  const selettore = document.getElementById("selettoreMese");
  const inputInizio = document.getElementById("dataInizio");
  const inputFine = document.getElementById("dataFine");

  // Eventi
  selettore.addEventListener("change", () => {
    if (selettore.value === "corrente") {
      impostaRangeMeseCorrente();
    } else if (selettore.value === "precedente") {
      impostaRangeMesePrecedente();
    }
  });

  inputInizio.addEventListener("change", () => {
    generaRighe(inputInizio.value, inputFine.value);
  });

  inputFine.addEventListener("change", () => {
    generaRighe(inputInizio.value, inputFine.value);
  });

  // Imposta inizialmente il mese corrente
  impostaRangeMeseCorrente();

  function impostaRangeMeseCorrente() {
    const oggi = DateTime.now();
    const primo = oggi.startOf("month").toFormat("yyyy-MM-dd");
    const ultimo = oggi.endOf("month").toFormat("yyyy-MM-dd");
    inputInizio.value = primo;
    inputFine.value = ultimo;
    generaRighe(primo, ultimo);
  }

  function impostaRangeMesePrecedente() {
    const oggi = DateTime.now().minus({ months: 1 });
    const primo = oggi.startOf("month").toFormat("yyyy-MM-dd");
    const ultimo = oggi.endOf("month").toFormat("yyyy-MM-dd");
    inputInizio.value = primo;
    inputFine.value = ultimo;
    generaRighe(primo, ultimo);
  }

  function generaRighe(dataInizio, dataFine) {
    tbody.innerHTML = "";
    if (!dataInizio || !dataFine) return;

    const inizio = DateTime.fromISO(dataInizio);
    const fine = DateTime.fromISO(dataFine);
    let giorno = inizio;

    while (giorno <= fine) {
      const riga = document.createElement("tr");

      const giornoNome = giorno.setLocale("it").toFormat("cccc d");
      const tdGiorno = document.createElement("td");
      tdGiorno.textContent = giornoNome;

      const tdEntrata = document.createElement("td");
      tdEntrata.textContent = "—";

      const tdUscita = document.createElement("td");
      tdUscita.textContent = "—";

      const tdTotale = document.createElement("td");
      tdTotale.textContent = "0";

      riga.appendChild(tdGiorno);
      riga.appendChild(tdEntrata);
      riga.appendChild(tdUscita);
      riga.appendChild(tdTotale);

      tbody.appendChild(riga);
      giorno = giorno.plus({ days: 1 });
    }

    totaleOreSpan.textContent = "0 ore";
  }
});

