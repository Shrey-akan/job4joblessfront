importScripts(
  "https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js",
);
firebase.initializeApp({
  apiKey: "AIzaSyDw9hdPbfmmlm22NmPxXg4s5mFd-ky0hGE",
  authDomain: "job4jobless-c7aa9.firebaseapp.com",
  projectId: "job4jobless-c7aa9",
  storageBucket: "job4jobless-c7aa9.appspot.com",
  messagingSenderId: "935423765278",
  appId: "1:935423765278:web:76fdc14021fe0be187b70f",
  measurementId: "G-WCE9812CJY"
});
const messaging = firebase.messaging();