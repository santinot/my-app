const moment = require("moment");
const checkContact = require("./contactFunctions").checkContact;

// Order messages by date (from most recent to least recent)
function orderByDate(list) {
  list.sort((a, b) => {
    const dataA = moment(
      Array.isArray(a) ? a[0].date : a.date,
      "DD/M/YYYY, HH:mm:ss"
    );
    const dataB = moment(
      Array.isArray(b) ? b[0].date : b.date,
      "DD/M/YYYY, HH:mm:ss"
    );
    return dataB - dataA;
  });
  return list;
}

// Group messages by sender
function MapReduce(list) {
  const map = new Map();

  // Map: group messages by sender
  list.forEach((item) => {
    const from = item.from;
    if (map.has(from)) {
      map.get(from).push(item);
    } else {
      map.set(from, [item]);
    }
  });

  // Reduce: convert the map to an array
  const result = Array.from(map.values());

  // Delete unnecessary arrays (if the sender has only one message)
  for (let i = 0; i < result.length; i++) {
    if (
      Array.isArray(result[i]) &&
      result[i].length === 1 &&
      typeof result[i][0] === "object"
    ) {
      result[i] = result[i][0];
    }
  }
  return result;
}

// Create threads of messages
async function createThread(listOfMessages, user) {
  // Input: ordered list of messages grouped by sender
  var threads = [];

  // Process each message checking if it is a contact
  async function processMessage(message) {
    let type, from;
    if (Array.isArray(message)) {
      [type, from] = [
        Array.isArray(message[0].type) ? message[0].type[0] : message[0].type,
        message[0].type === "gmail" || message[0].type[0] === "gmail"
          ? message[0].from
          : message[0].id,
      ];
    } else {
      [type, from] = [
        Array.isArray(message.type) ? message.type[0] : message.type,
        message.type === "gmail" || message.type[0] === "gmail"
          ? message.from
          : message.id,
      ];
    }
    const res = await checkContact(user, type, from); // Function from contactFunctions.js

    // If the sender is a contact, add the message to the threadm, if exists, otherwise create a new thread
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

  // Process message in parallel (async)
  return Promise.all(listOfMessages.map(processMessage)).then(() => {
    return threads;
  });
}

// Order threads by date (from most recent to least recent)
function orderByDateThread(list) {
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
    return dataB - dataA;
  });
  return list;
}

// Main Function
async function getMessages(user) {
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
    // List of messages (email and whatsapp) ordered by date and grouped by sender(email)
    const rawData = orderByDate(
      MapReduce(emailMessagesJson).concat(whatsappMessagesJson)
    );
    const result = await createThread(rawData, user);
    return orderByDateThread(result);
  } catch (error) {
    console.error("An error occurred:", error);
    return { error: "Internal server error" };
  }
}

// Get sentiment analysis
async function sentimentAnalysis(id, message) {
  try {
    let score = null;
    // Fetch messages from the API
    const dbMessagesResponse = await fetch(
      "http://127.0.0.1:5000/api/messages/get",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!dbMessagesResponse.ok) {
      throw new Error(
        `Failed to fetch messages. Status: ${dbMessagesResponse.status}`
      );
    }

    const messagesData = await dbMessagesResponse.json();

    // Check if the message with the given id and content exists
    const foundMessage = messagesData.find(
      (msg) => msg.id === id && msg.message === message
    );

    if (!foundMessage) {
      // Fetch sentiment analysis score
      const scoreResponse = await fetch("http://127.0.0.1:5000/api/analysis", {
        method: "POST",
        body: JSON.stringify({ message: message }),
        headers: { "Content-Type": "application/json" },
      });

      if (!scoreResponse.ok) {
        throw new Error(
          `Failed to fetch sentiment analysis score. Status: ${scoreResponse.status}`
        );
      }

      // Parse the score from the response
      const scoreData = await scoreResponse.json();
      score = scoreData.value;

      // Insert the message into the database with the obtained score
      await fetch("http://127.0.0.1:5000/api/messages/insert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, message, score }),
      });
    } else {
      // Use the score from the found message
      score = foundMessage.score;
    }

    return score;
  } catch (error) {
    console.error("Error in sentimentAnalysis:", error.message);
    // Handle the error or rethrow it as needed
    throw error;
  }
}

module.exports = {
  getMessages,
  sentimentAnalysis,
};
