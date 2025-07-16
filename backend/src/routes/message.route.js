import {Router} from "express"
import { getAllUsers, getMessages, sendMessage } from "../controllers/message.controller.js"
import { verifyJwt } from "../middlewares/auth.middlewares.js"

const router= Router()

router.route("/users").get(verifyJwt,getAllUsers)
router.route("/:receiverId").get(verifyJwt,getMessages)
router.route("/send/:id").post(verifyJwt,sendMessage)

export default router