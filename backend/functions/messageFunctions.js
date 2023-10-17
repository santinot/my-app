const moment = require("moment");
const { type } = require("os");
const checkContact = require("./contactFunctions").checkContact;

function orderByDate(list) {
  // Utilizza moment.js per analizzare le date nell'ultimo elemento di ciascun oggetto
  list.sort((a, b) => {
    const dataA = moment(
      Array.isArray(a) ? a[0].date : a.date,
      "DD/M/YYYY, HH:mm:ss"
    );
    const dataB = moment(
      Array.isArray(b) ? b[0].date : b.date,
      "DD/M/YYYY, HH:mm:ss"
    );
    return dataB - dataA; // Ordine decrescente (dal più recente al meno recente)
  });
  return list;
}

function MapReduce(list) {
  const map = new Map();

  // Fase di Map: Raggruppa le email per mittente
  list.forEach((item) => {
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
    if (
      Array.isArray(result[i]) &&
      result[i].length === 1 &&
      typeof result[i][0] === "object"
    ) {
      result[i] = result[i][0]; // Converte l'elemento in un dizionario
    }
  }

  return result;
}


async function createThread(listOfMessages) {
  // Input: lista ordinata e raggruppata per mittente
  var threads = [];

  // Creiamo una funzione asincrona per poter aspettare che checkContact() sia completato
  async function processMessage(message) {
    let type, from;
    if (Array.isArray(message)) {
      [type, from] = [
        Array.isArray(message[0].type) ? message[0].type[0] : message[0].type,
        message[0].type === "gmail" ? message[0].from : message[0].id,
      ];
    } else {
      [type, from] = [
        Array.isArray(message.type) ? message.type[0] : message.type,
        message.type === "gmail" ? message.from : message.id,
      ];
    }
    const res = await checkContact(type, from);
    if (res != null) {
      const existingThread = threads.find(
        (thread) => thread.label === res.label
      );
      if (existingThread) {
        existingThread.values.push(message);
      } else {
        threads.push({
          label: res.label,
          values: [message],
        });
      }
    } else {
      threads.push(message);
    }
  }

  // Utilizziamo Promise.all per elaborare tutti i messaggi in parallelo
  return Promise.all(listOfMessages.map(processMessage)).then(() => {
    return threads;
  });
}

function orderByDateThread(list) {
  // Utilizza moment.js per analizzare le date nell'ultimo elemento di ciascun oggetto
  list.sort((a, b) => {
    if (Array.isArray(a)) {
      a = a[0].date;
    } else if (typeof a.values !== "undefined") {
      a = a.values[0].date;
    } else {
      a = a.date;
    }

    if (Array.isArray(b)) {
      b = b[0].date;
    } else if (typeof b.values !== "undefined") {
      b = b.values[0].date;
    } else {
      b = b.date;
    }

    const dataA = moment(a, "DD/M/YYYY, HH:mm:ss");
    const dataB = moment(b, "DD/M/YYYY, HH:mm:ss");
    return dataB - dataA; // Ordine decrescente (dal più recente al meno recente)
  });
  return list;
}

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
    const rawData = orderByDate(
      MapReduce(emailMessagesJson).concat(whatsappMessagesJson)
    );
    // Esecuzione della funzione principale
    const result = await createThread(rawData);
    return orderByDateThread(result);
  } catch (error) {
    console.error("An error occurred:", error);
    return { error: "Internal server error" };
  }
}

module.exports = {
  getMessages,
};
