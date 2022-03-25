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
  searchListings,
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
// orders
// router.get("/user-application-bookings", requireSignin, userapplicationBookings);
// router.get("/is-already-booked/:applicationId", requireSignin, isAlreadyBooked);
router.post("/search-listings", searchListings);

module.exports = router;
