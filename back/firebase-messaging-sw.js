const { getMessaging, getToken  } = require('firebase-admin/messaging');

// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
const messaging = getMessaging(app);
getToken(messaging, {vapidKey: "BDBoTDlT9PJYLfZllVXc0_qknmNHfKdXJKiZ6_94Ga4U63eRAcWN0PAgnsOWUMpg_JlXQdRMpVzlnABWJaObghM"})
.then((currentToken) => {
  if (currentToken) {
    console.log(currentToken);
  } else {
    // Show permission request UI
    console.log('No registration token available. Request permission to generate one.');
    // ...
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
  // ...
});