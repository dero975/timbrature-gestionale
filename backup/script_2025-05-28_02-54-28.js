const giorni = [
  "Giovedì 1", "Venerdì 2", "Sabato 3", "Domenica 4",
  "Lunedì 5", "Martedì 6", "Mercoledì 7", "Giovedì 8",
  "Venerdì 9", "Sabato 10", "Domenica 11", "Lunedì 13"
];

const tabella = document.getElementById("tabella-timbrature");
let totaleMensile = 0;

giorni.forEach(giorno => {
  const tr = document.createElement("tr");

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
});

// Mostra totale mensile (fisso a 0)
document.getElementById("totale-mensile").textContent = totaleMensile;

// Esporta tabella in Excel
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

