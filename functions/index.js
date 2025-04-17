const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Function to log incidents triggered by GCP Monitoring alerts
exports.logIncident = functions.https.onRequest((req, res) => {
  const incidentData = req.body; // Assuming your GCP alert sends JSON data

  // Extract relevant data from the GCP alert
  const title = incidentData.incident.title || 'Unknown Title';
  const description = incidentData.incident.description || 'No description provided';
  const severity = incidentData.incident.severity || 'Unknown';
  
  // Log the incident to Firestore
  admin.firestore().collection('incidents').add({
    title: title,
    description: description,
    severity: severity,
    status: 'open',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  })
  .then(docRef => {
    res.status(200).send(`Incident logged with ID: ${docRef.id}`);
  })
  .catch((error) => {
    res.status(500).send('Error logging incident: ' + error);
  });
});
