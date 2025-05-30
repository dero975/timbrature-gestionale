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
  const divInizio = document.getElementById("dataInizio");
  const divFine = document.getElementById("dataFine");

  selettore.addEventListener("change", aggiornaPeriodo);
  divInizio.addEventListener("blur", aggiornaPeriodo);
  divFine.addEventListener("blur", aggiornaPeriodo);

  impostaRangeMeseCorrente();

  function impostaRangeMeseCorrente() {
    const oggi = DateTime.now();
    const primo = oggi.startOf("month").toFormat("dd/MM/yyyy");
    const ultimo = oggi.endOf("month").toFormat("dd/MM/yyyy");
    divInizio.textContent = primo;
    divFine.textContent = ultimo;
    disabilitaModificaDate();
    generaRighe(primo, ultimo);
  }

  function impostaRangeMesePrecedente() {
    const oggi = DateTime.now().minus({ months: 1 });
    const primo = oggi.startOf("month").toFormat("dd/MM/yyyy");
    const ultimo = oggi.endOf("month").toFormat("dd/MM/yyyy");
    divInizio.textContent = primo;
    divFine.textContent = ultimo;
    disabilitaModificaDate();
    generaRighe(primo, ultimo);
  }

  function abilitaModificaDate() {
    divInizio.contentEditable = true;
    divFine.contentEditable = true;
    divInizio.style.border = "1px solid white";
    divFine.style.border = "1px solid white";
  }

  function disabilitaModificaDate() {
    divInizio.contentEditable = false;
    divFine.contentEditable = false;
    divInizio.style.border = "none";
    divFine.style.border = "none";
  }

  function aggiornaPeriodo() {
    const valore = selettore.value;
    if (valore === "corrente") {
      impostaRangeMeseCorrente();
    } else if (valore === "precedente") {
      impostaRangeMesePrecedente();
    } else if (valore === "personalizzato") {
      abilitaModificaDate();
      const inizio = divInizio.textContent.trim();
      const fine = divFine.textContent.trim();
      generaRighe(inizio, fine);
    }
  }

  function generaRighe(dataInizio, dataFine) {
    tbody.innerHTML = "";
    const inizio = DateTime.fromFormat(dataInizio, "dd/MM/yyyy");
    const fine = DateTime.fromFormat(dataFine, "dd/MM/yyyy");

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

