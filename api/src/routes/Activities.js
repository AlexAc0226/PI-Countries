const { Router } = require("express");
const router = Router();

const { newActivity, getActivity, getNameActivities, deleteActivity, updateActivity } = require("../constrollers/Activities.js");

router.put("/:name", updateActivity)

router.delete("/delete", deleteActivity)

router.post("/new", newActivity);

router.get("/byname", getNameActivities)
router.get("/", getActivity);

module.exports = router;
