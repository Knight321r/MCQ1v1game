import { Router } from "express";
import * as controllers from '../controllers/controller.js';
import { protect } from "../authMiddleware.js";

const router = Router();
//normal routes
router.route('/question/:id').get(controllers.getquestions).post(controllers.postquestions)
router.route('/signup').post(controllers.handlesignup).get(controllers.getsomething)
router.route('/login').post(controllers.handlelogin)
//mcqlists routes
router.use('/mcqlists', protect)
router.route('/mcqlists').get(controllers.getmcqlists).post(controllers.addmcqlists);
router.route('/mcqlists/:id').delete(controllers.deletemcqlist);
//mcq routes
router.route('/mcqlists/:id/mcqs').get(controllers.getmcq).post(controllers.addmcq)
router.route('/mcqlists/:id/mcqs/:mcqid').delete(controllers.deletemcq).put(controllers.updatemcq)

export default router;