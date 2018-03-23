module.exports = function (email) {
	return new Promise(function (resolve, reject) {
		var fs = require("fs");
		var path = require("path");
		var readline = require("readline");
		var google = require("googleapis");
		var googleAuth = require("google-auth-library");

		// If modifying these scopes, delete your previously saved credentials
		// at ~/.credentials/gmail-nodejs-quickstart.json
		var SCOPES = [
			"https://mail.google.com/",
			"https://www.googleapis.com/auth/gmail.metadata",
			"https://www.googleapis.com/auth/gmail.readonly",
			"https://www.googleapis.com/auth/gmail.modify",
			"https://www.googleapis.com/auth/gmail.compose"
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
			var clientSecret = credentials.installed.client_secret;
			var clientId = credentials.installed.client_id;
			var redirectUrl = credentials.installed.redirect_uris[0];
			var auth = new googleAuth();
			var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
			// var callbackURL = config.baseurl + '/oauth2callback';

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
					// var labels = response.labels;
					// if (labels.length == 0) {
					// 	console.log("No labels found.");
					// } else {
					// 	console.log("Labels:");
					// 	var emailArray = [];
					// 	for (var i = 0; i < labels.length; i++) {
					// 		var label = labels[i];
					// 		emailArray.push(label.name);
					// 		console.log("- %s", label.name);
					// 	}
					// 	resolve(emailArray);
					// }
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
					// console.log("Request body: ");
					// console.log(response);
					// console.log("nextPageToken: ");
					// console.log(response.nextPageToken);
					// console.log(response.messages[0].id);
					// console.log(response.messages[1].id);
					// console.log(response.messages[2].id);
					// console.log(response.messages[3].id);
					// console.log(response.messages[4].id);


					var emailArray = [];
					for (i = 0; i < 5; i++) {
						var currentMessages = response.messages[i].id;
						gmail.users.messages.get({
								auth: auth,
								userId: "me",
								// id: response.messages.id,
								id: currentMessages,
								format: "full",
							//format: "raw"
							},
							function (err, response) {
								if (err) {
									console.log("The API returned an error: " + err);
									return;
								}

								// console.log(response.payload.headers);

								// console.log("Message Sent to: ");

								// console.log(response.payload.headers[0].value);

								// console.log("Message Received On: ");
								// console.log(response.payload.headers[22].value);

								// console.log("Message Sent From: ");
								// console.log(response.payload.headers[17].value);

								// console.log("Subject of the Message: ");
								// console.log(response.payload.headers[21].value);

								// console.log("A short part of the message text: ");
								

								console.log(response.snippet);
                emailArray.push(response.snippet);
                resolve(emailArray);
                
							}
						);
					}
				}
			);
		}
	});
};