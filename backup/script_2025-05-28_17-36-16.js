let dipendenti = [];

function aggiornaTabella() {
  const tbody = document.getElementById("lista-dipendenti");
  if (!tbody) return; // evita errori su altre pagine
  tbody.innerHTML = "";

  dipendenti.sort((a, b) => a.pin - b.pin).forEach((d, index) => {
    const tr = document.createElement("tr");

    // Pulsante storico
    const storicoBtn = document.createElement("button");
    storicoBtn.className = "btn-storico";
    storicoBtn.innerHTML = "📂";
    storicoBtn.onclick = () => {
      window.location.href = `storico.html?pin=${d.pin}`;
    };

    const tdStorico = document.createElement("td");
    tdStorico.appendChild(storicoBtn);

    const tdPin = document.createElement("td");
    tdPin.textContent = d.pin.toString().padStart(2, "0");

    const tdNome = document.createElement("td");
    tdNome.textContent = d.nome;

    const tdCognome = document.createElement("td");
    tdCognome.textContent = d.cognome;

    const tdEmail = document.createElement("td");
    tdEmail.textContent = d.email;

    const btnModifica = document.createElement("button");
    btnModifica.textContent = "✏️";
    btnModifica.onclick = () => modificaDipendente(index);

    const btnElimina = document.createElement("button");
    btnElimina.textContent = "❌";
    btnElimina.onclick = () => eliminaDipendente(index);

    const tdModifica = document.createElement("td");
    tdModifica.appendChild(btnModifica);

    const tdElimina = document.createElement("td");
    tdElimina.appendChild(btnElimina);

    tr.appendChild(tdStorico);
    tr.appendChild(tdPin);
    tr.appendChild(tdNome);
    tr.appendChild(tdCognome);
    tr.appendChild(tdEmail);
    tr.appendChild(tdModifica);
    tr.appendChild(tdElimina);

    tbody.appendChild(tr);
  });
}

function aggiungiDipendente() {
  const nome = document.getElementById("nome").value.trim();
  const cognome = document.getElementById("cognome").value.trim();
  const pin = parseInt(document.getElementById("pin").value);
  const email = document.getElementById("email").value.trim();

  if (!nome || !cognome || isNaN(pin) || pin < 0 || pin > 99 || !email) {
    alert("Compila correttamente tutti i campi.");
    return;
  }

  dipendenti.push({ nome, cognome, pin, email });
  aggiornaTabella();
  document.getElementById("nome").value = "";
  document.getElementById("cognome").value = "";
  document.getElementById("pin").value = "";
  document.getElementById("email").value = "";
}

function eliminaDipendente(index) {
  if (confirm("Sei sicuro di voler eliminare questo dipendente?")) {
    dipendenti.splice(index, 1);
    aggiornaTabella();
  }
}

function modificaDipendente(index) {
  const d = dipendenti[index];
  document.getElementById("nome").value = d.nome;
  document.getElementById("cognome").value = d.cognome;
  document.getElementById("pin").value = d.pin;
  document.getElementById("email").value = d.email;
  dipendenti.splice(index, 1); // Rimuove temporaneamente per reinserirlo aggiornato
}

// Autocarica tabella se presente
document.addEventListener("DOMContentLoaded", aggiornaTabella);

