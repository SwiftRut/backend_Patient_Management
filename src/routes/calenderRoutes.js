import express from 'express'
import { createtimeslotfordoctor, deletetime, doctoravilableslot, updatetime } from '../controllers/calenderController.js'
const router = express.Router()

router.post("/create" , createtimeslotfordoctor)
router.get("/gettime/:doctorId" , doctoravilableslot)
router.put("/update/:id" , updatetime)
router.delete("/delete/:id" , deletetime)


export default router