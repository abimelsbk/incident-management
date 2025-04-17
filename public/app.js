import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDVRV50Utqb0TGeBd0IviyfRRiEWkLXGpE",
  authDomain: "incident-8c57f.firebaseapp.com",
  projectId: "incident-8c57f",
  storageBucket: "incident-8c57f.firebasestorage.app",
  messagingSenderId: "472818277830",
  appId: "1:472818277830:web:e4ad8b073a7f90716f66c7",
  measurementId: "G-WL166Z3V50"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const form = document.getElementById('incidentForm');
const titleInput = document.getElementById('title');
const descInput = document.getElementById('description');
const incidentList = document.getElementById('incidentList');

// Handle form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const description = descInput.value.trim();

  if (!title || !description) return;

  try {
    await addDoc(collection(db, "incidents"), {
      title,
      description,
      createdAt: serverTimestamp(),
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

// Real-time updates
const q = query(collection(db, "incidents"), orderBy("createdAt", "desc"));
onSnapshot(q, (snapshot) => {
  incidentList.innerHTML = '';
  snapshot.forEach(doc => {
    const data = doc.data();
    const createdAt = data.createdAt?.toDate().toLocaleString() || 'Just now';

    const item = document.createElement('div');
    item.className = 'incident-card';
    item.innerHTML = `
      <h3>${data.title}</h3>
      <p>${data.description}</p>
      <p><strong>Status:</strong> ${data.status}</p>
      <p><strong>Created At:</strong> ${createdAt}</p>
    `;
    incidentList.appendChild(item);
  });
});
