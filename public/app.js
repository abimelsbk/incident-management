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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ticketForm = document.getElementById("ticketForm");
const ticketsDiv = document.getElementById("tickets");

ticketForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const desc = document.getElementById("desc").value;

  await addDoc(collection(db, "tickets"), {
    title,
    description: desc,
    status: "Open",
    createdAt: serverTimestamp(),
    troubleshootingSteps: [],
  });

  ticketForm.reset();
});

onSnapshot(collection(db, "tickets"), (snapshot) => {
  ticketsDiv.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    ticketsDiv.innerHTML += `
      <div style="border:1px solid #aaa; padding:10px; margin:10px 0;">
        <strong>${data.title}</strong><br>
        ${data.description}<br>
        <em>Status: ${data.status}</em>
      </div>`;
  });
});
