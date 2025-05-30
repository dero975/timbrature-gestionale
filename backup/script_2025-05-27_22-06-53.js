// Elementi
const pinInput = document.getElementById("pin");
const buttons = document.querySelectorAll(".keypad button");
const messageBox = document.getElementById("message-box");

let ultimaTimbratura = null; // Memorizza l'ultima azione: "ENTRATA" o "USCITA"

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

// Pulsanti Entrata / Uscita
document.querySelector(".entrata").addEventListener("click", () => {
  gestisciTimbratura("ENTRATA");
});

document.querySelector(".uscita").addEventListener("click", () => {
  gestisciTimbratura("USCITA");
});

// Funzione di gestione
function gestisciTimbratura(tipo) {
  if (pinInput.value === "") {
    alert("Inserisci il PIN prima di timbrare.");
    return;
  }

  if (ultimaTimbratura === tipo) {
    alert(`Hai già effettuato ${tipo.toLowerCase()}!`);
    return;
  }

  const now = new Date();
  const ore = now.getHours().toString().padStart(2, '0');
  const minuti = now.getMinutes().toString().padStart(2, '0');
  const orario = `ore ${ore}:${minuti}`;

  messageBox.innerHTML = `
    DAVIDE DE ROSE<br>
    ${tipo} CONFERMATA<br>
    <span class="time">${orario}</span>
  `;

  ultimaTimbratura = tipo;
  pinInput.value = "";
}

