const express = require("express");

const dataRoutes = require("../controllers/data-controller");

const router = express.Router();

router.get("/video-length", dataRoutes.getVideoLength);
router.get("/yearly-count", dataRoutes.getYearlyCount);
router.get("/watch-hours", dataRoutes.getWatchHours);
router.get("/times-rank", dataRoutes.getTimesRank);
router.get("/duration-rank", dataRoutes.getDurationRank);

module.exports = router;
