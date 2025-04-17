const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const app = express();

admin.initializeApp();
app.use(express.json()); // ✅ Needed to parse JSON from GCP alerts

// Function to log incidents triggered by GCP Monitoring alerts
app.post('/', async (req, res) => {
  try {
    const incidentData = req.body;

    // Optional: log the payload for debugging
    console.log("Received incident data:", JSON.stringify(incidentData, null, 2));

    const incident = incidentData.incident || {};

    const title = incident.summary || 'No title';
    const description = incident.documentation?.content || 'No description';
    const severity = incident.severity || 'UNKNOWN';

    const docRef = await admin.firestore().collection('incidents').add({
      title,
      description,
      severity,
      status: 'open',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).send(`Incident logged with ID: ${docRef.id}`);
  } catch (error) {
    console.error("Error logging incident:", error);
    res.status(500).send('Error logging incident: ' + error.message);
  }
});

exports.logIncident = functions.https.onRequest(app);
