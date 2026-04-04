const { supabase } = require('../config/supabaseConfig');
const express = require('express');
const router = express.Router();

router.post('/analyze-report', async (req, res) => {
  try {
    const { reportUrl, userId } = req.body;

    if (!reportUrl || !userId) {
  return res.status(400).json({ error: "Missing data" });
    }

    console.log("API HIT:");
    console.log("Report URL:", reportUrl);
    console.log("User ID:", userId);

    // 🔥 teammate will replace this
    const mockAiAnalysis = "AI Analysis: Patient shows stable markers.";

    return res.status(200).json({
      success: true,
      analysis: mockAiAnalysis,
      fileUrl: reportUrl
    });

  } catch (error) {
    console.error("Route Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;