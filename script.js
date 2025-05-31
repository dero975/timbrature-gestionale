document.addEventListener("DOMContentLoaded", () => {
  const DateTime = luxon.DateTime;
  const pin = new URLSearchParams(window.location.search).get("pin");
  const nomeEl = document.getElementById("nomeUtente");
  const tbody = document.getElementById("tabellaTimbrature");
  const totaleOreSpan = document.getElementById("totaleOre");
  const selettore = document.getElementById("selettoreMese");
  const inputInizio = document.getElementById("dataInizio");
  const inputFine = document.getElementById("dataFine");

  if (!pin || !tbody || !nomeEl) return;

  // Supabase client - assicurati che window.supabase sia inizializzato in storico.html
  const supabase = window.supabase;

  // Gestione filtro periodo
  selettore.addEventListener("change", () => {
    if (selettore.value === "corrente") {
      impostaRangeMeseCorrente();
    } else if (selettore.value === "precedente") {
      impostaRangeMesePrecedente();
    }
  });

  inputInizio.addEventListener("change", () => {
    caricaEVisualizzaStorico(inputInizio.value, inputFine.value);
  });

  inputFine.addEventListener("change", () => {
    caricaEVisualizzaStorico(inputInizio.value, inputFine.value);
  });

  // Imposta inizialmente il mese corrente
  impostaRangeMeseCorrente();

  // Funzione principale che carica e mostra lo storico
  async function caricaEVisualizzaStorico(dataInizio, dataFine) {
    tbody.innerHTML = "";
    totaleOreSpan.textContent = "0 ore";

    const inizio = DateTime.fromISO(dataInizio);
    const fine = DateTime.fromISO(dataFine);

    if (inizio > fine) {
      alert("La data inizio deve essere precedente alla data fine");
      return;
    }

    // Query a Supabase per timbrature utente e date filtrate
    const { data, error } = await supabase
      .from("timbrature")
      .select("*")
      .eq("pin", pin)
      .gte("data", dataInizio)
      .lte("data", dataFine)
      .order("data", { ascending: true })
      .order("ora", { ascending: true });

    if (error) {
      alert("Errore caricamento storico: " + error.message);
      console.error(error);
      return;
    }

    // Visualizza nome utente
    if (data.length > 0) {
      nomeEl.textContent = data[0].nome;
    } else {
      nomeEl.textContent = "Utente sconosciuto";
    }

    // Raggruppa timbrature per giorno
    const giorni = {};
    data.forEach(item => {
      if (!giorni[item.data]) {
        giorni[item.data] = { entrate: [], uscite: [] };
      }
      if (item.tipo === "entrata") {
        giorni[item.data].entrate.push(item.ora);
      } else if (item.tipo === "uscita") {
        giorni[item.data].uscite.push(item.ora);
      }
    });

    // Crea righe tabella per ogni giorno del range
    let totaleOre = 0;
    let giorno = inizio;

    while (giorno <= fine) {
      const giornoStr = giorno.toISODate();
      const entrate = giorni[giornoStr]?.entrate || [];
      const uscite = giorni[giornoStr]?.uscite || [];

      // Calcola ore totali per il giorno
      let oreGiornaliere = 0;
      const coppie = Math.min(entrate.length, uscite.length);
      for (let i = 0; i < coppie; i++) {
        const inizio = DateTime.fromISO(`${giornoStr}T${entrate[i]}:00`);
        const fine = DateTime.fromISO(`${giornoStr}T${uscite[i]}:00`);
        oreGiornaliere += fine.diff(inizio, "hours").hours;
      }
      totaleOre += oreGiornaliere;

      // Formatta giorno e ore
      const giornoNomeRaw = giorno.setLocale("it").toFormat("cccc d");
      const giornoNome = giornoNomeRaw.charAt(0).toUpperCase() + giornoNomeRaw.slice(1);
      const oreFormattate = oreGiornaliere.toFixed(2);

      // Crea riga
      const riga = document.createElement("tr");
      riga.innerHTML = `
        <td>${giornoNome}</td>
        <td>${entrate.join(", ") || "—"}</td>
        <td>${uscite.join(", ") || "—"}</td>
        <td>${oreFormattate}</td>
      `;
      tbody.appendChild(riga);

      giorno = giorno.plus({ days: 1 });
    }

    totaleOreSpan.textContent = totaleOre.toFixed(2) + " ore";
  }

  // Funzioni per filtro mese corrente e precedente
  function impostaRangeMeseCorrente() {
    const oggi = DateTime.now();
    const primo = oggi.startOf("month").toISODate();
    const ultimo = oggi.endOf("month").toISODate();
    inputInizio.value = primo;
    inputFine.value = ultimo;
    caricaEVisualizzaStorico(primo, ultimo);
  }

  function impostaRangeMesePrecedente() {
    const oggi = DateTime.now().minus({ months: 1 });
    const primo = oggi.startOf("month").toISODate();
    const ultimo = oggi.endOf("month").toISODate();
    inputInizio.value = primo;
    inputFine.value = ultimo;
    caricaEVisualizzaStorico(primo, ultimo);
  }
});

