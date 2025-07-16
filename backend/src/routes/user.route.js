import {Router} from "express"
// import {upload} from "../middlewares/multer.middlewares.js"

import {
    registerUser,
    loginUser,
    logoutUser,
    updateProfileImg,
    getCurrentUser
} from "../controllers/user.controller.js"
import { verifyJwt } from "../middlewares/auth.middlewares.js"

const router= Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(logoutUser)
router.route("/update-profilepic").post(verifyJwt,updateProfileImg)
router.route("/get-user").get(verifyJwt,getCurrentUser)

export default router