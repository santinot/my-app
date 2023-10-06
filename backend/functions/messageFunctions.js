const moment = require("moment");
async function getMessages(){
  try{
  const emailMessages = await fetch("http://localhost:3001/api/email/me/getEmails", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const emailMessagesJson = await emailMessages.json();
  //console.log(emailMessagesJson);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal gmail server error" });
  }
  try{
  const whatsappMessages = await fetch("http://localhost:3001/api/whatsapp/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
} catch (error) {
  console.error("An error occurred:", error);
  res.status(500).json({ error: "Internal whatsapp server error" });
}
  const whatsappMessagesJson = await whatsappMessages.json();
  //console.log(whatsappMessagesJson);
  return orderByDate(emailMessagesJson.concat(whatsappMessagesJson));
}

function orderByDate(list){
    // Utilizza moment.js per analizzare le date nell'ultimo elemento di ciascun oggetto
    list.sort((a, b) => {
      const dataA = moment(a[a.length - 1], "DD/M/YYYY, HH:mm:ss");
      const dataB = moment(b[b.length - 1], "DD/M/YYYY, HH:mm:ss");
      return dataB - dataA; // Ordine decrescente (dal più recente al meno recente)
    });
  
    return list;
}

module.exports = {
  getMessages
};