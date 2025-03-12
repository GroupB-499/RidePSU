importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

firebase.initializeApp({ projectId: "ridepsu-8b9fc", appId: "1:996061760535:web:922b8e96b32f8dcc8a6052", storageBucket: "ridepsu-8b9fc.firebasestorage.app", apiKey: "AIzaSyDNfEo3bZ-x8MSh4btnjbgzLONryzrzHpA", authDomain: "ridepsu-8b9fc.firebaseapp.com", messagingSenderId: "996061760535", measurementId: "G-RM2960T6RG", });

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log("Received background message ", payload);
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/assets/icons/icon-192x192.png"
    });
});
