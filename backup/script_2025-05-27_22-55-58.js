// Supabase config
const SUPABASE_URL = "https://pylfpqitdogatlsndxtf.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5bGZwcWl0ZG9nYXRsc25keHRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNzU5OTcsImV4cCI6MjA2Mzk1MTk5N30.GXWmglDP7WcLSozta8UT6Ktd9XzIXSCxC5pJ4oWX3LU";

const headers = {
  "Content-Type": "application/json",
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`
};

// Elementi DOM
const pinInput = document.getElementById("pin");
const buttons = document.querySelectorAll(".keypad button");
const messageBox = document.getElementById("message-box");

let ultimaTimbratura = null;

// Tastierino numerico
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const val = btn.textContent;
    if (val === "C") {
      pinInput.value = "";
    } else {
      if (pinInput.value.length < 6) {
        pinInput.value += val;
      }
    }
  });
});

// Azioni
document.querySelector(".entrata").addEventListener("click", () => {
  gestisciTimbratura("ENTRATA");
});

document.querySelector(".uscita").addEventListener("click", () => {
  gestisciTimbratura("USCITA");
});

// Funzione principale
function gestisciTimbratura(tipo) {
  const pin = pinInput.value;
  const nome = "DAVIDE DE ROSE";

  if (!pin) {
    alert("Inserisci il PIN prima di timbrare.");
    return;
  }

  if (ultimaTimbratura === tipo) {
    alert(`Hai già effettuato ${tipo.toLowerCase()}!`);
    return;
  }

  const now = new Date();
  const orario = `ore ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  // Mostra conferma
  messageBox.innerHTML = `
    ${nome}<br>
    ${tipo} CONFERMATA<br>
    <span class="time">${orario}</span>
  `;

  // Invia a Supabase
  fetch(`${SUPABASE_URL}/rest/v1/timbrature`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      tipo,
      pin,
      nome
    })
  })
  .then(res => {
    if (!res.ok) throw new Error("Errore nel salvataggio su Supabase");
    return; // non tentare di leggere JSON vuoto
  })
  .then(() => {
    console.log("Timbratura salvata con successo.");
  })
  .catch(err => {
    alert("Errore durante il salvataggio: " + err.message);
  });

  ultimaTimbratura = tipo;
  pinInput.value = "";
}

