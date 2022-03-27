import express from "express";

const router = express.Router();

// middleware
import { requireSignin, applicationOwner } from "../middlewares/index";
// controllers
import {
  create,
  applications,
  myapplications,
  remove,
  read,
  update,
} from "../controllers/application";

router.post("/create-application", requireSignin, create);
router.get("/applications", applications);
router.get("/my-applications", requireSignin, myapplications);
router.delete("/delete-application/:applicationId", requireSignin, applicationOwner, remove);
router.get("/application/:applicationId", read);
router.put(
  "/update-application/:applicationId",
  requireSignin,
  applicationOwner,
  update
);

module.exports = router;
