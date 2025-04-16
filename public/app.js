import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
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
