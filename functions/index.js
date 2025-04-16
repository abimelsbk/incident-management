const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

exports.gcpIncidentListener = functions.pubsub.topic('incident-alerts').onPublish(async (message) => {
  const alertData = message.json;

  await db.collection("tickets").add({
    title: alertData.incident?.policy_name || "GCP Alert",
    description: alertData.incident?.summary || "Auto-generated incident",
    status: "Open",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    troubleshootingSteps: [],
  });
});
