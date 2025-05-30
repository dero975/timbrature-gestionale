let pin = "";
let utenti = [];

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
  document.getElementById("display").textContent = pin;
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
    document.getElementById("conferma").textContent = "PIN non valido";
    document.getElementById("conferma").style.background = "#dc3545";
  } else {
    document.getElementById("conferma").textContent = `${utente.nome.toUpperCase()} ${utente.cognome.toUpperCase()}\n${tipo.toUpperCase()} CONFERMATA\nore ${ora}`;
    document.getElementById("conferma").style.background = "#ccc";

    // aggiorna ultima timbratura
    document.getElementById("ultima").textContent = `Ultima timbratura: ${tipo} ore ${ora}`;
  }

  pin = "";
  aggiornaDisplayPin();
}

window.onload = () => {
  caricaUtenti();
};

