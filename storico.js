document.addEventListener("DOMContentLoaded", () => {
  const DateTime = luxon.DateTime;
  const selettore = document.getElementById("selettoreMese");
  const divInizio = document.getElementById("dataInizio");
  const divFine = document.getElementById("dataFine");

  impostaRangeMeseCorrente();

  selettore.addEventListener("change", () => {
    const valore = selettore.value;
    if (valore === "corrente") {
      impostaRangeMeseCorrente();
    } else if (valore === "precedente") {
      impostaRangeMesePrecedente();
    } else if (valore === "personalizzato") {
      abilitaModificaDate();
    }
  });

  function impostaRangeMeseCorrente() {
    const oggi = DateTime.now();
    const primo = oggi.startOf("month").toFormat("dd/MM/yyyy");
    const ultimo = oggi.endOf("month").toFormat("dd/MM/yyyy");
    divInizio.textContent = primo;
    divFine.textContent = ultimo;
    disabilitaModificaDate();
    caricaTimbrature(primo, ultimo);
  }

  function impostaRangeMesePrecedente() {
    const oggi = DateTime.now().minus({ months: 1 });
    const primo = oggi.startOf("month").toFormat("dd/MM/yyyy");
    const ultimo = oggi.endOf("month").toFormat("dd/MM/yyyy");
    divInizio.textContent = primo;
    divFine.textContent = ultimo;
    disabilitaModificaDate();
    caricaTimbrature(primo, ultimo);
  }

  function abilitaModificaDate() {
    divInizio.contentEditable = true;
    divFine.contentEditable = true;
    divInizio.style.border = "1px solid white";
    divFine.style.border = "1px solid white";

    divInizio.addEventListener("blur", () => {
      caricaTimbrature(divInizio.textContent, divFine.textContent);
    });
    divFine.addEventListener("blur", () => {
      caricaTimbrature(divInizio.textContent, divFine.textContent);
    });
  }

  function disabilitaModificaDate() {
    divInizio.contentEditable = false;
    divFine.contentEditable = false;
    divInizio.style.border = "none";
    divFine.style.border = "none";
  }

  function caricaTimbrature(dataInizio, dataFine) {
    console.log("📅 Carico timbrature dal", dataInizio, "al", dataFine);
    // Qui potrai in futuro collegare Supabase o generare righe fittizie
  }
});

