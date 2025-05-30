// Elementi principali
const pinInput = document.getElementById("pin");
const buttons = document.querySelectorAll(".keypad button");
const messageBox = document.getElementById("message-box");

// Aggiungi numero al campo PIN
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

// Azioni Entrata/Uscita
document.querySelector(".entrata").addEventListener("click", () => {
  confermaTimbratura("ENTRATA");
});

document.querySelector(".uscita").addEventListener("click", () => {
  confermaTimbratura("USCITA");
});

// Funzione di conferma
function confermaTimbratura(tipo) {
  if (pinInput.value === "") {
    alert("Inserisci il PIN prima di timbrare.");
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

  pinInput.value = "";
}

