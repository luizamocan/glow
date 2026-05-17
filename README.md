# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Secure LAN Lab Run

1. Find the backend machine IP on the hotspot/LAN:

   ```powershell
   ipconfig
   ```

   Example: `172.20.10.5`.

2. Generate a local HTTPS certificate for that IP:

   ```powershell
   powershell -ExecutionPolicy Bypass -File backend\scripts\create-dev-cert.ps1 -IpAddress 172.20.10.5
   ```

3. Start the backend on the server machine:

   ```powershell
   cd backend
   npm.cmd start
   ```

   It should print `API: https://0.0.0.0:5000` and `WS: wss://0.0.0.0:5000`.

4. Start the frontend on the client machine or the same machine for phone testing:

   ```powershell
   cd frontend
   $env:REACT_APP_API_URL="https://172.20.10.5:5000"
   npm.cmd run start:https
   ```

5. Open the app on the phone/client:

   ```text
   https://172.20.10.5:3000
   ```

   Because the certificate is self-signed, the browser may ask you to accept a privacy warning once for the frontend and once for `https://172.20.10.5:5000`.

## Authentication

- Passwords are stored as PBKDF2 hashes.
- Login/register responses return a signed token.
- Protected API requests use `Authorization: Bearer <token>`.
- Admin routes reject client tokens.
- Client appointment routes use the email from the token, not spoofable headers.
- The frontend logs the user out after inactivity.

## Tests

Backend:

```powershell
cd backend
npm.cmd test -- --runInBand
```

Frontend:

```powershell
cd frontend
npm.cmd test -- --watchAll=false
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
