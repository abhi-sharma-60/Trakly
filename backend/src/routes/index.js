import express from "express"
import login from "../controllers/UserController/login.js"
import signup from "../controllers/UserController/signup.js"

const router = express.Router()

router.get("/login",login)
router.post("/signup",signup)

export default router