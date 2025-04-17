import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDVRV50Utqb0TGeBd0IviyfRRiEWkLXGpE",
  authDomain: "incident-8c57f.firebaseapp.com",
  projectId: "incident-8c57f",
  storageBucket: "incident-8c57f.firebasestorage.app",
  messagingSenderId: "472818277830",
  appId: "1:472818277830:web:e4ad8b073a7f90716f66c7",
  measurementId: "G-WL166Z3V50"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const form = document.getElementById('ticketForm');
const ticketList = document.getElementById('ticketList');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const desc = document.getElementById('desc').value;

  await db.collection('tickets').add({
    title,
    desc,
    createdAt: new Date(),
    status: 'Open',
  });

  form.reset();
});

db.collection('tickets').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
  ticketList.innerHTML = '';
  snapshot.forEach(doc => {
    const data = doc.data();
    ticketList.innerHTML += `<li><strong>${data.title}</strong>: ${data.desc} [${data.status}]</li>`;
  });
});