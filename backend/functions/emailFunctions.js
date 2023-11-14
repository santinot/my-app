const fs = require("fs").promises;
const fs2 = require("fs");
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");
const moment = require("moment");
const os = require("os");
const downloadPath = path.join(os.homedir(), "Downloads");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://mail.google.com/"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

// Check if token is still valid or not
function checkToken(error) {
  if (error === "Token has been expired or revoked.") {
    if (fs2.existsSync(TOKEN_PATH)) {
      fs2.unlink(TOKEN_PATH, (err) => {
        // Delete token.json
        if (err) {
          return "Error:", err;
        } else {
          return { error: "Token expired, try again." };
        }
      });
    }
  }
}
//@param {google.auth.OAuth2} auth An authorized OAuth2 client.

// Get page token list
async function pageTokenList(param_userId, param_labelIds) {
  const nextPageTokens = [];
  nextPageTokens.push("");
  const auth = await authorize();
  const gmail = google.gmail({ version: "v1", auth });
  let pageToken = "";
  let count = 0;
  do {
    const response = await gmail.users.messages
      .list({
        userId: param_userId,
        labelIds: [param_labelIds.toUpperCase()],
        maxResults: 30,   // Number of email in a page
        pageToken,
      })
      .catch((error) => {
        console.error("Error:", error);
        return checkToken(error.response.data.error_description);
      });
    const nextPageToken = response.data.nextPageToken;
    nextPageTokens.push(nextPageToken);
    pageToken = nextPageToken;
    count++;
  } while (pageToken && count < 10); 
  return nextPageTokens;
}

// Get sentiment analysis
async function sentimentAnalysis(message) {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/post", {
      method: "POST",
      body: JSON.stringify({ message: message }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
}

// Get emails
async function getEmails(param_userId, param_labelIds, param_pageToken) {
  const auth = await authorize();
  const gmail = google.gmail({ version: "v1", auth });
  const response = await gmail.users.messages
    .list({   // Get the list of messages
      userId: param_userId,
      labelIds: [param_labelIds.toUpperCase()],   // "INBOX" is the default value, but you can use other labels, like "TRASH"
      maxResults: 30,
      pageToken: param_pageToken === undefined ? "" : param_pageToken,  // if empty, get the first page of results
    })
    .catch((res) => {
      return checkToken(res.response.data.error_description);
    });
  // Use map to create an array of promises for the get operations
  const getPromises = response.data.messages.map(async (message) => {
    const res = await gmail.users.messages.get({
      // Get the entire actual message using the message id
      userId: param_userId,
      id: message.id,
    });
    let media = [];
    // Check if there are attachments
    if (res.data.payload.parts) {
      for (let i = 0; i < res.data.payload.parts.length; i++) {
        if (res.data.payload.parts[i].body.attachmentId) {
          media.push({
            title: res.data.payload.parts[i].filename,
            id: res.data.payload.parts[i].body.attachmentId,
          });
        }
      }
    }
    let sentiment = null;
    if (res.data.snippet) {
      sentiment = await sentimentAnalysis(res.data.snippet);
    }
    return {
      id: res.data.id,
      type: media.length != 0 ? ["gmail", media] : "gmail",
      from: res.data.payload.headers.filter(
        (header) => header.name === "From"
      )[0].value,
      subject: res.data.payload.headers.filter(
        (header) => header.name === "Subject"
      )[0].value,
      snippet: res.data.snippet,
      sentiment: sentiment ? sentiment.value : null,
      date: moment(
        res.data.payload.headers.filter((header) => header.name === "Date")[0]
          .value,
        "ddd, DD MMM YYYY HH:mm:ss Z"
      ).format("DD/M/YYYY, HH:mm:ss"),
    };
  });
  // Wait for all the promises to resolve
  const array = await Promise.all(getPromises);
  return array;
}

// Get profile informations
async function getProfile(param_userId) {
  const auth = await authorize();
  const gmail = google.gmail({ version: "v1", auth });
  const response = await gmail.users
    .getProfile({
      userId: param_userId,
    })
    .catch((res) => {
      return checkToken(res.response.data.error_description);
    });
  return response.data;
}

// Send email
async function sendEmail(param_userId, param_to, param_subject, param_message) {
  const auth = await authorize();
  const gmail = google.gmail({ version: "v1", auth });
  // Create the message in base64 format
  const raw = Buffer.from(  
    `From: "me" <${param_userId}>\n` +
      `To: ${param_to}\n` +
      `Subject: ${param_subject}\n\n` +
      `${param_message}`
  ).toString("base64");
  const response = await gmail.users.messages
    .send({
      userId: param_userId,
      resource: {
        raw: raw,
      },
    })
    .catch((res) => {
      return checkToken(res.response.data.error_description);
    });
  return response.data;
}

// async function trashEmail(param_userId, param_messageId) {
//   const auth = await authorize();
//   const gmail = google.gmail({ version: "v1", auth });
//   const response = await gmail.users.messages
//     .trash({
//       userId: param_userId,
//       id: param_messageId,
//     })
//     .catch((res) => {
//       return checkToken(res.response.data.error_description);
//     });
//   return response.data;
// }

// async function untrashEmail(param_userId, param_messageId) {
//   const auth = await authorize();
//   const gmail = google.gmail({ version: "v1", auth });
//   const response = await gmail.users.messages
//     .untrash({
//       userId: param_userId,
//       id: param_messageId,
//     })
//     .catch((res) => {
//       return checkToken(res.response.data.error_description);
//     });
//   return response.data;
// }

// Download attachment by id and save it to the download folder of pc
async function getAttachment(
  param_userId,
  param_messageId,
  param_attachmentId,
  param_filename
) {
  const auth = await authorize();
  const gmail = google.gmail({ version: "v1", auth });
  const response = await gmail.users.messages.attachments
    .get({
      userId: param_userId,
      messageId: param_messageId,
      id: param_attachmentId,
    })
    .catch((res) => {
      return checkToken(res.response.data.error_description);
    });
  const filename = param_filename || "untitled-attachment";
  fs2.writeFileSync(
    `${downloadPath}/${filename}`,
    Buffer.from(response.data.data, "base64")
  );
  console.log(`Downloaded ${filename}`);
  return response.data;
}

// Get a single email ???
async function singleEmail(param_userId, param_messageId) {
  const auth = await authorize();
  const gmail = google.gmail({ version: "v1", auth });
  const response = await gmail.users.messages
    .get({
      userId: param_userId,
      id: param_messageId,
    })
    .catch((res) => {
      return checkToken(res.response.data.error_description);
    });
  var text = "";
  var decodedText = "";
  response.data.payload.parts.forEach((element) => {
    if (element.mimeType === "text/plain") {
      text = element.body.data;
      decodedText = Buffer.from(text, "base64").toString("utf-8");
      decodedText = decodedText.replace(/^-+/g, "");
      decodedText = decodedText.replace(/^[\r\n]+|[\r\n]+$/g, "");
    }
  });
  return decodedText;
}

// Logout deleting token.json file 
function logoutProfile() {
  try {
    if (fs2.existsSync(TOKEN_PATH)) {
      fs2.unlinkSync(TOKEN_PATH);
      return 200;
    } else {
      return 404;
    }
  } catch (error) {
    console.error("Errore durante il logout del profilo:", error);
    return 500;
  }
}

module.exports = {
  getProfile,
  getEmails,
  sendEmail,
  getAttachment,
  singleEmail,
  pageTokenList,
  logoutProfile,
};
