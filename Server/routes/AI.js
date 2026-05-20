const express = require("express");
const router = express.Router();

const {
  askAIAdvisor,
  getAIRecommendations,
} = require("../controllers/AI");

router.get("/recommendations", getAIRecommendations);
router.post("/advisor", askAIAdvisor);

module.exports = router;
