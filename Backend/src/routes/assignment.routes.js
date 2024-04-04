import { Router } from "express";
import { getAssignments, giveAssignment, solutionAssignment} from "../controllers/assignment.controller.js";
 const router = Router();
 router.route("/assignments").post(giveAssignment)
 router.route("/getAssignments").get(getAssignments)
router.route("/solAssignment").post(solutionAssignment)
 export default router;