document.addEventListener("DOMContentLoaded", () => {
  const giorni = [
    "Giovedì 1", "Venerdì 2", "Sabato 3", "Domenica 4", "Lunedì 5",
    "Martedì 6", "Mercoledì 7", "Giovedì 8", "Venerdì 9", "Sabato 10",
    "Domenica 11", "Lunedì 13"
  ];

  const storico = document.getElementById("storico");
  const totaleMensile = document.getElementById("totale-ore");

  let totaleOre = 0;

  giorni.forEach(giorno => {
    const tr = document.createElement("tr");

    const tdGiorno = document.createElement("td");
    tdGiorno.textContent = giorno;
    tr.appendChild(tdGiorno);

    const tdEntrata = document.createElement("td");
    tdEntrata.textContent = "—";
    tr.appendChild(tdEntrata);

    const tdUscita = document.createElement("td");
    tdUscita.textContent = "—";
    tr.appendChild(tdUscita);

    const tdOre = document.createElement("td");
    tdOre.textContent = "0";
    tr.appendChild(tdOre);

    storico.appendChild(tr);
  });

  totaleMensile.textContent = totaleOre;
});

