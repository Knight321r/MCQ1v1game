import {Router} from 'express'
import * as controllers from './dupcontroller.js'
const router = Router()

router.route('/:id').get(controllers.getreq).post(controllers.postreq)

export default router