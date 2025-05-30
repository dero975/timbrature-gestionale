const tabella = document.getElementById("tabella-timbrature");
const totaleMensileEl = document.getElementById("totale-mensile");
const dataInizioInput = document.getElementById("data-inizio");
const dataFineInput = document.getElementById("data-fine");
const filtroSelect = document.getElementById("filtro-mese");

function formattaData(data) {
  return data.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric' });
}

function generaTabella(inizioStr, fineStr) {
  tabella.innerHTML = "";
  let totale = 0;

  const inizio = new Date(inizioStr);
  const fine = new Date(fineStr);

  for (let d = new Date(inizio); d <= fine; d.setDate(d.getDate() + 1)) {
    const tr = document.createElement("tr");

    const giornoSettimana = d.toLocaleDateString('it-IT', { weekday: 'long' });
    const giornoNumero = d.getDate();
    const giorno = `${giornoSettimana.charAt(0).toUpperCase() + giornoSettimana.slice(1)} ${giornoNumero}`;

    const tdGiorno = document.createElement("td");
    tdGiorno.textContent = giorno;

    const tdEntrata = document.createElement("td");
    tdEntrata.textContent = "—";

    const tdUscita = document.createElement("td");
    tdUscita.textContent = "—";

    const tdOre = document.createElement("td");
    tdOre.textContent = "0";

    tr.appendChild(tdGiorno);
    tr.appendChild(tdEntrata);
    tr.appendChild(tdUscita);
    tr.appendChild(tdOre);

    tabella.appendChild(tr);
  }

  totaleMensileEl.textContent = totale;
}

// Dropdown logica automatica
filtroSelect.addEventListener("change", () => {
  const oggi = new Date();
  const anno = oggi.getFullYear();
  const mese = oggi.getMonth();

  if (filtroSelect.value === "mese corrente") {
    dataInizioInput.value = `${anno}-${String(mese + 1).padStart(2, '0')}-01`;
    dataFineInput.value = `${anno}-${String(mese + 1).padStart(2, '0')}-${new Date(anno, mese + 1, 0).getDate()}`;
  } else if (filtroSelect.value === "mese precedente") {
    const mesePrec = mese - 1 < 0 ? 11 : mese - 1;
    const annoPrec = mese - 1 < 0 ? anno - 1 : anno;
    dataInizioInput.value = `${annoPrec}-${String(mesePrec + 1).padStart(2, '0')}-01`;
    dataFineInput.value = `${annoPrec}-${String(mesePrec + 1).padStart(2, '0')}-${new Date(annoPrec, mesePrec + 1, 0).getDate()}`;
  } else if (filtroSelect.value === "settimana corrente") {
    const giornoSettimana = oggi.getDay(); // 0 = domenica
    const lunedi = new Date(oggi);
    lunedi.setDate(oggi.getDate() - (giornoSettimana === 0 ? 6 : giornoSettimana - 1));
    const domenica = new Date(lunedi);
    domenica.setDate(lunedi.getDate() + 6);
    dataInizioInput.value = lunedi.toISOString().slice(0, 10);
    dataFineInput.value = domenica.toISOString().slice(0, 10);
  }
  aggiornaTabella();
});

// Aggiorna tabella quando cambiano le date
dataInizioInput.addEventListener("change", aggiornaTabella);
dataFineInput.addEventListener("change", aggiornaTabella);

function aggiornaTabella() {
  generaTabella(dataInizioInput.value, dataFineInput.value);
}

// Esporta CSV
document.getElementById("esporta").addEventListener("click", () => {
  let csv = "Giorno,Entrata,Uscita,Totale ore\n";
  tabella.querySelectorAll("tr").forEach(tr => {
    const cols = tr.querySelectorAll("td");
    const row = Array.from(cols).map(td => td.textContent).join(",");
    csv += row + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "timbrature_mese.csv";
  a.click();
  URL.revokeObjectURL(url);
});

// Avvio iniziale
aggiornaTabella();

