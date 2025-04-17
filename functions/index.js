const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();
const db = getFirestore();

exports.autoLogIncident = onRequest(async (req, res) => {
  try {
    const incident = {
      title: req.body.incident?.summary || "GCP Alert",
      description: req.body.incident?.condition?.name || "Auto-logged incident from GCP",
      timestamp: new Date().toISOString(),
    };

    await db.collection("incidents").add(incident);
    res.status(200).send("Incident logged successfully");
  } catch (err) {
    console.error("Error logging incident:", err);
    res.status(500).send("Failed to log incident");
  }
});
