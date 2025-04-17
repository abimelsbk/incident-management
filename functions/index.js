const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

exports.logGCPAlert = functions.https.onRequest(async (req, res) => {
  try {
    const alertData = req.body;

    await db.collection('incidents').add({
      title: alertData.incident || 'GCP Alert',
      description: JSON.stringify(alertData),
      createdAt: new Date(),
      status: 'Auto-logged',
    });

    res.status(200).send('Alert logged successfully.');
  } catch (error) {
    console.error('Error logging alert:', error);
    res.status(500).send('Error logging alert.');
  }
});
