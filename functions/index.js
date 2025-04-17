const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const app = express();

admin.initializeApp();
app.use(express.json());

// Endpoint for GCP alert
app.post('/', async (req, res) => {
  try {
    const incidentData = req.body;
    const incident = incidentData.incident || {};

    const title = incident.summary || 'GCP Alert';
    const description = incident.documentation?.content || 'No additional info';
    const severity = incident.severity || 'UNKNOWN';

    const docRef = await admin.firestore().collection('incidents').add({
      title,
      description,
      severity,
      source: 'gcp', // 👈 Add this
      createdAt: admin.firestore.FieldValue.serverTimestamp(), // 👈 Ensures compatibility
      status: 'open',
    });

    res.status(200).send(`Incident logged with ID: ${docRef.id}`);
  } catch (error) {
    console.error("Error logging GCP incident:", error);
    res.status(500).send('Error logging incident: ' + error.message);
  }
});

exports.logIncident = functions.https.onRequest(app);
