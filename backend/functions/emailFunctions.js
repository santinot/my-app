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

function checkToken(error) {
  if (error === "Token has been expired or revoked.") {
    if (fs.existsSync(TOKEN_PATH)) {
      fs.unlink(TOKEN_PATH, (err) => {
        if (err) {
          console.error("Error:", err);
          return;
        } else {
          console.log("Token expired, try again.");
        }
      });
    }
  }
}
//@param {google.auth.OAuth2} auth An authorized OAuth2 client.

async function getEmails(param_userId, param_labelIds) {
  const auth = await authorize().catch( (res) => {
    checkToken(res.data.error_description)
    }
  );
  const gmail = google.gmail({ version: "v1", auth });
  const response = await gmail.users.messages.list({
    // Get the list of messages
    userId: param_userId,
    labelIds: [param_labelIds.toUpperCase()], // "INBOX" is the default value, but you can use other labels, like "TRASH"
    maxResults: 4,
    pageToken: "", // if empty, get the first page of results. For the next page, use the nextPageToken returned by the previous call
  });
  // Use map to create an array of promises for the get operations
  const getPromises = response.data.messages.map(async (message) => {
    const res = await gmail.users.messages.get({
      // Get the entire actual message using the message id
      userId: param_userId,
      id: message.id,
    });
    let media = [];
    if (res.data.payload.parts) {
      for (let i = 0; i < res.data.payload.parts.length; i++) {
        if (res.data.payload.parts[i].body.attachmentId) {
          media.push({
            "title" : res.data.payload.parts[i].filename,
            "id" : res.data.payload.parts[i].body.attachmentId
          })
        }
      }
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

async function getProfile(param_userId) {
  const auth = await authorize().catch( (res) => {
    checkToken(res.data.error_description)
    }
  );
  const gmail = google.gmail({ version: "v1", auth });
  const response = await gmail.users.getProfile({
    userId: param_userId,
  });
  return response.data;
}

async function sendEmail(param_userId, param_to, param_subject, param_message) {
  const auth = await authorize().catch( (res) => {
    checkToken(res.data.error_description)
    }
  );
  const gmail = google.gmail({ version: "v1", auth });
  const raw = Buffer.from(
    `From: "me" <${param_userId}>\n` +
      `To: ${param_to}\n` +
      `Subject: ${param_subject}\n\n` +
      `${param_message}`
  ).toString("base64");
  const response = await gmail.users.messages.send({
    userId: param_userId,
    resource: {
      raw: raw,
    },
  });
  return response.data;
}

async function trashEmail(param_userId, param_messageId) {
  const auth = await authorize().catch( (res) => {
    checkToken(res.data.error_description)
    }
  );
  const gmail = google.gmail({ version: "v1", auth });
  const response = await gmail.users.messages.trash({
    userId: param_userId,
    id: param_messageId,
  });
  return response.data;
}

async function untrashEmail(param_userId, param_messageId) {
  const auth = await authorize().catch( (res) => {
    checkToken(res.data.error_description)
    }
  );
  const gmail = google.gmail({ version: "v1", auth });
  const response = await gmail.users.messages.untrash({
    userId: param_userId,
    id: param_messageId,
  });
  return response.data;
}

async function getAttachment(
  param_userId,
  param_messageId,
  param_attachmentId,
  param_filename
) {
  const auth = await authorize().catch( (res) => {
    checkToken(res.data.error_description)
    }
  );
  const gmail = google.gmail({ version: "v1", auth });
  const response = await gmail.users.messages.attachments.get({
    userId: param_userId,
    messageId: param_messageId,
    id: param_attachmentId,
  });
  // Save the attachment to a file
  const filename = param_filename || "untitled-attachment";
  fs2.writeFileSync(
    `${downloadPath}/${filename}`,
    Buffer.from(response.data.data, "base64")
  );
  console.log(`Downloaded ${filename}`);
  return response.data;
}

module.exports = {
  getProfile,
  getEmails,
  sendEmail,
  trashEmail,
  untrashEmail,
  getAttachment,
};
