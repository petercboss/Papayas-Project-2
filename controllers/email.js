module.exports = function (email) {
	return new Promise(function (resolve, reject) {
		var fs = require("fs");
		var path = require("path");
		var readline = require("readline");
		var google = require("googleapis");
		var googleAuth = require("google-auth-library");
		var GoogleStrategy = require("passport-google-oauth20").OAuth2Strategy;

		// If modifying these scopes, delete your previously saved credentials
		// at ~/.credentials/gmail-nodejs-quickstart.json
		var SCOPES = [
			"https://mail.google.com/",
			"https://www.googleapis.com/auth/gmail.metadata",
			"https://www.googleapis.com/auth/gmail.readonly",
			"https://www.googleapis.com/auth/calendar"
		];
		var TOKEN_DIR =
			(process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) +
			"/.credentials/";
		var TOKEN_PATH = TOKEN_DIR + "gmail-nodejs-quickstart.json";

		// Load client secrets from a local file.
		fs.readFile(
			path.resolve(__dirname, "../config/email.json"),
			function processClientSecrets(err, content) {
				if (err) {
					console.log("Error loading client secret file: " + err);
					return;
				}
				// Authorize a client with the loaded credentials, then call the
				// Gmail API.
				authorize(JSON.parse(content), listLabels);
			}
		);

		/**
		 * Create an OAuth2 client with the given credentials, and then execute the
		 * given callback function.
		 *
		 * @param {Object} credentials The authorization client credentials.
		 * @param {function} callback The callback to call with the authorized client.
		 */
		function authorize(credentials, callback) {
			var clientId = credentials.installed.client_id;
			var clientSecret = credentials.installed.client_secret;
			var redirectUrl = credentials.installed.redirect_uris[0];
			var auth = new googleAuth();
			var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
			// var callbackURL = redirect_uris[0] + "/oauth2callback";
			// console.log(callbackURL);
			// console.log(window.location.origin);

			// Check if we have previously stored a token.
			fs.readFile(TOKEN_PATH, function (err, token) {
				if (err) {
					getNewToken(oauth2Client, callback);
				} else {
					oauth2Client.credentials = JSON.parse(token);
					callback(oauth2Client);
				}
			});
		}

		/**
		 * Get and store new token after prompting for user authorization, and then
		 * execute the given callback with the authorized OAuth2 client.
		 *
		 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
		 * @param {getEventsCallback} callback The callback to call with the authorized
		 *     client.
		 */
		function getNewToken(oauth2Client, callback) {
			var authUrl = oauth2Client.generateAuthUrl({
				access_type: "offline",
				scope: SCOPES
			});
			// Need to go to oAuth Page Now

			console.log("Authorize this app by visiting this url: ", authUrl);
			var rl = readline.createInterface({
				input: process.stdin,
				output: process.stdout
			});
			rl.question("Enter the code from that page here: ", function (code) {
				rl.close();
				oauth2Client.getToken(code, function (err, token) {
					if (err) {
						console.log("Error while trying to retrieve access token", err);
						return;
					}
					oauth2Client.credentials = token;
					storeToken(token);
					callback(oauth2Client);
				});
			});
		}

		/**
		 * Store token to disk be used in later program executions.
		 *
		 * @param {Object} token The token to store to disk.
		 */
		function storeToken(token) {
			try {
				fs.mkdirSync(TOKEN_DIR);
			} catch (err) {
				if (err.code != "EEXIST") {
					throw err;
				}
			}
			fs.writeFile(TOKEN_PATH, JSON.stringify(token));
			// console.log("Token stored to " + TOKEN_PATH);
		}
		/**
		 * Lists the labels in the user's account.
		 *
		 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
		 */
		function listLabels(auth) {
			var gmail = google.gmail("v1");
			gmail.users.labels.list({
					auth: auth,
					userId: "me"
				},
				function (err, response) {
					if (err) {
						console.log("The API returned an error: " + err);
						return;
					}
				}
			);
			// Lists the messages in the user's mailbox with Users.messages: list
			gmail.users.messages.list({
					auth: auth,
					userId: "me"
				},
				function (err, response) {
					if (err) {
						console.log("The API returned an error: " + err);
						return;
					}

					var emailArray = [];
					for (i = 0; i < 5; i++) {
						var currentMessages = response.messages[i].id;
						gmail.users.messages.get({
								auth: auth,
								userId: "me",
								id: currentMessages,
								format: "full",
							},
							function (err, response) {
								if (err) {
									console.log("The API returned an error: " + err);
									return;
								}

								let emails = response.payload.headers;
								// console.log(emails);

								// console.log(response.payload.headers);

								// Message Sent to
								let sentTo = emails[0].value;
								console.log('Sent To ');
								console.log(sentTo);

								// Message Received On
								let receivedOn = emails[1].value;
								console.log('Recieved On ');
								console.log(receivedOn);

								// Message Sent From
								let sentFrom = JSON.stringify(emails[18]);
								console.log('Sent From ');
								console.log(sentFrom);

								// Subject of the Message
								let messageSubject = JSON.stringify(emails[21]);
								console.log('Subject: ');
								console.log(messageSubject);
								// console.log(response.payload.mimeType);

								// A short part of the message text
								let emailSnippet = response.snippet;
								console.log('Snippet: ');
								console.log(emailSnippet);

								// console.log("response.payload.headers: ");
								// console.log(response.payload.headers);
								// emailArray.push(`<ul><li>Sent To: ${sentTo}</li><li>Received On: ${receivedOn}</li><li>${sentFrom}</li><li>${messageSubject}</li><li>${emailSnippet}</li></ul>`);
								// resolve(emailArray);
								emailArray.push(`<ul>Message # ${i++}<li>Sent To: ${sentTo}</li><li>Received On: ${receivedOn}</li><li>${emailSnippet}</li></ul>`);
								resolve(emailArray);
							}
						);
					}
				}
			);
		}
	});
};