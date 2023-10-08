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

//@param {google.auth.OAuth2} auth An authorized OAuth2 client.

async function getEmails(param_userId, param_labelIds) {
  const auth = await authorize();
  const gmail = google.gmail({ version: "v1", auth });
  const response = await gmail.users.messages.list({ // Get the list of messages
    userId: param_userId,
    labelIds: [param_labelIds.toUpperCase()], // "INBOX" is the default value, but you can use other labels, like "TRASH"
    maxResults: 2,
    pageToken: "", // if empty, get the first page of results. For the next page, use the nextPageToken returned by the previous call
  });
  // Use map to create an array of promises for the get operations
  const getPromises = response.data.messages.map(async (message) => {
    const res = await gmail.users.messages.get({  // Get the entire actual message using the message id
      userId: param_userId,
      id: message.id
    });
    for (const part of res.data.payload.parts) {
      if (part.body.attachmentId) {
        var attachment = [res.data.id ,part.body.attachmentId];
      };
    };
    return [
      res.data.id,
      (attachment ? ["gmail", attachment] : "gmail"),
      res.data.payload.headers.filter((header) => header.name === "From")[0]
      .value,
      res.data.payload.headers.filter((header) => header.name === "Subject")[0]
      .value,
      res.data.snippet,
      moment(res.data.payload.headers.filter((header) => header.name === "Date")[0].value, "ddd, DD MMM YYYY HH:mm:ss Z").format("DD/M/YYYY, HH:mm:ss")
    ];
  });
  // Wait for all the promises to resolve
  const lista = await Promise.all(getPromises);
  return lista;
}

async function getProfile(param_userId) {
  const auth = await authorize();
  const gmail = google.gmail({ version: "v1", auth });
  const response = await gmail.users.getProfile({
    userId: param_userId,
  });
  return response.data;
}

async function sendEmails(param_userId, param_to, param_subject, param_message) {
  const auth = await authorize();
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

async function trashEmails(param_userId, param_messageId) {
  const auth = await authorize();
  const gmail = google.gmail({ version: "v1", auth });
  const response = await gmail.users.messages.trash({
    userId: param_userId,
    id: param_messageId,
  });
  return response.data;
}

async function untrashEmails(param_userId, param_messageId) {
  const auth = await authorize();
  const gmail = google.gmail({ version: "v1", auth });
  const response = await gmail.users.messages.untrash({
    userId: param_userId,
    id: param_messageId,
  });
  return response.data;
}

async function getAttachments(param_userId, param_messageId, param_attachmentId, param_filename) {
  const auth = await authorize();
  const gmail = google.gmail({ version: "v1", auth });
  const response = await gmail.users.messages.attachments.get({
    userId: param_userId,
    messageId: param_messageId,
    id: param_attachmentId,
  });
  // Save the attachment to a file
  const filename = param_filename || 'untitled-attachment';
  fs2.writeFileSync(`${downloadPath}/${filename}`, Buffer.from(response.data.data, 'base64'));
  console.log(`Downloaded ${filename}`);
  return response.data;
}

module.exports = {
  getProfile,
  getEmails,
  sendEmails,
  trashEmails,
  untrashEmails,
  getAttachments,
};