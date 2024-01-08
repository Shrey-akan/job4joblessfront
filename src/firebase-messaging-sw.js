importScripts(
  "https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js",
);
firebase.initializeApp({
  // apiKey: "config data from general tab",
  // authDomain: "config data from general tab",
  // projectId: "config data from general tab",
  // storageBucket: "config data from general tab",
  // messagingSenderId: "config data from general tab",
  // appId: "config data from general tab",
  // measurementId: "config data from general tab"
  apiKey: "AIzaSyB3qyfF9Dxaqg2mW2hy5LkHRINhSv8V8ZA",
  authDomain: "hawkjob-29010.firebaseapp.com",
  projectId: "hawkjob-29010",
  storageBucket: "hawkjob-29010.appspot.com",
  messagingSenderId: "889757152232",
  appId: "1:889757152232:web:31651a407764be03aaaa5d",
  measurementId: "G-LYN6V264TL",
});
const messaging = firebase.messaging();
// messaging.userPublicVapidkey("BFDKJ5p5-HZhOY7zC2vde_pDytahoTIfoqs4ayCR8CSYWP-Jym3Vz2XP4E5yDjxqiD5pLST1PFMLESwaVrGB1IU")
// messaging.onBackgroundMessage((payload) => {
//   console.log(
//     "[firebase-messaging-sw.js] Received background message ",
//     payload
//   );
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: payload.notification.image,
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });