const https = require("https");

const verifyGoogleCredential = (credential) =>
  new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === "test" && credential.startsWith("test-google:")) {
      const email = credential.slice("test-google:".length);
      return resolve({
        googleId: `test-${email}`,
        email,
        name: "Google Test User",
      });
    }

    const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`;
    https
      .get(url, (res) => {
        let body = "";
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          let payload;
          try {
            payload = JSON.parse(body);
          } catch (_) {
            return reject(new Error("Invalid Google response"));
          }

          if (res.statusCode !== 200 || payload.error) {
            return reject(new Error(payload.error_description || "Google credential is invalid"));
          }

          if (process.env.GOOGLE_CLIENT_ID && payload.aud !== process.env.GOOGLE_CLIENT_ID) {
            return reject(new Error("Google credential audience does not match this app"));
          }

          return resolve({
            googleId: payload.sub,
            email: payload.email,
            name: payload.name || payload.email,
          });
        });
      })
      .on("error", reject);
  });

module.exports = { verifyGoogleCredential };
