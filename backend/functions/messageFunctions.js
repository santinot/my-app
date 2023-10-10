const moment = require("moment");

async function getMessages() {
  try {
    const emailMessages = await fetch(
      "http://localhost:3001/api/email/me/getEmails/inbox",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    var emailMessagesJson = await emailMessages.json();

    const whatsappMessages = await fetch(
      "http://localhost:3001/api/whatsapp/chats",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    var whatsappMessagesJson = await whatsappMessages.json();
    return orderByDate(MapReduce(emailMessagesJson).concat(whatsappMessagesJson));
  } catch (error) {
    console.error("An error occurred:", error);
    return({ error: "Internal whatsapp server error" });
  }
}

function orderByDate(list) {
  // Utilizza moment.js per analizzare le date nell'ultimo elemento di ciascun oggetto
  list.sort((a, b) => {
    const dataA = moment(Array.isArray(a)? a[0].date : a.date, "DD/M/YYYY, HH:mm:ss");
    const dataB = moment(Array.isArray(b)? b[0].date : b.date, "DD/M/YYYY, HH:mm:ss");
    return dataB - dataA; // Ordine decrescente (dal più recente al meno recente)
  });
  return list;
}

function MapReduce(list){  
  const map = new Map();

  // Fase di Map: Raggruppa le email per mittente
  list.forEach(item => {
    const from = item.from;
    if (map.has(from)) {
      map.get(from).push(item);
    } else {
      map.set(from, [item]);
    }
  });

  // Fase di Reduce: Converti la mappa in un array di liste di email
  const result = Array.from(map.values());

  // Elimina le liste di lunghezza 1
  for (let i = 0; i < result.length; i++) {
    if (Array.isArray(result[i]) && result[i].length === 1 && typeof result[i][0] === 'object') {
      result[i] = result[i][0]; // Converte l'elemento in un dizionario
    }
  }

  return result;
}

function createThread(){
  // TODO
}

module.exports = {
  getMessages,
};
