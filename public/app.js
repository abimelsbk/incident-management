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

const form = document.getElementById('incidentForm');
const titleInput = document.getElementById('title');
const descInput = document.getElementById('description');
const incidentList = document.getElementById('incidentList');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const description = descInput.value.trim();

  if (!title || !description) return;

  try {
    await db.collection("incidents").add({
      title,
      description,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      status: "Open"
    });

    titleInput.value = "";
    descInput.value = "";
    alert("Ticket logged successfully!");
  } catch (error) {
    console.error("Error adding document: ", error);
    alert("Error logging ticket.");
  }
});

db.collection("incidents").orderBy("createdAt", "desc").onSnapshot(snapshot => {
  incidentList.innerHTML = '';
  snapshot.forEach(doc => {
    const data = doc.data();

    const createdAt = data.createdAt?.toDate().toLocaleString() || "Unknown";

    const item = document.createElement('div');
    item.classList.add('incident-card'); // Add CSS class

    item.innerHTML = `
      <h3>${data.title}</h3>
      <p>${data.description}</p>
      <p><strong>Status:</strong> ${data.status}</p>
      <p><strong>Created At:</strong> ${createdAt}</p>
    `;

    incidentList.appendChild(item);
  });
});
