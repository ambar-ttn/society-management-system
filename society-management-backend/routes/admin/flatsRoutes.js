import express from "express";
const router = express.Router();

import {
  createFlat,
  getFlats,
  updateFlat,
  deleteFlat
} from "../../controllers/admin/flatsController.js";

import { auth, isAdmin } from "../../middlewares/auth.js";


// adding a flat
router.post("/flats", auth, isAdmin, createFlat);



// deleting a flat
router.delete("/flats/:id", auth, isAdmin, deleteFlat);




// updating a flat
router.put("/flats/:id", auth, isAdmin, updateFlat);




// getting flat information
router.get("/flats", auth, isAdmin, getFlats);


export default router;