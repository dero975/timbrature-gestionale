document.addEventListener("DOMContentLoaded", () => {
  const giorni = [
    "Giovedì 1", "Venerdì 2", "Sabato 3", "Domenica 4", "Lunedì 5", "Martedì 6",
    "Mercoledì 7", "Giovedì 8", "Venerdì 9", "Sabato 10", "Domenica 11", "Lunedì 13"
  ];

  const tableBody = document.getElementById("tableBody");
  let totaleOreMensili = 0;

  giorni.forEach(giorno => {
    const tr = document.createElement("tr");

    const tdGiorno = document.createElement("td");
    tdGiorno.textContent = giorno;

    const tdEntrata = document.createElement("td");
    tdEntrata.textContent = "—";

    const tdUscita = document.createElement("td");
    tdUscita.textContent = "—";

    const tdTotale = document.createElement("td");
    tdTotale.textContent = "0";

    tr.appendChild(tdGiorno);
    tr.appendChild(tdEntrata);
    tr.appendChild(tdUscita);
    tr.appendChild(tdTotale);

    tableBody.appendChild(tr);
  });

  document.getElementById("totaleOre").textContent = totaleOreMensili;

  document.getElementById("exportBtn").addEventListener("click", () => {
    alert("Funzione di esportazione Excel non ancora implementata.");
  });
});

