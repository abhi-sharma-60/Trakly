import express from "express"
import login from "../controllers/UserController/login.js"
import signup from "../controllers/UserController/signup.js"
import googleLogin from "../controllers/UserController/googleLogin.js"
import { syncDashboard } from "../controllers/platformController/syncUserStats.js"
import { syncLeetCodeManual } from "../controllers/platformController/leetcode/sync.js"
import { syncCodeforces } from "../controllers/platformController/codeforces/sync.js"
import { getCodeforcesDetails } from "../controllers/platformController/codeforces/getDetails.js"
import { linkCodeforces } from "../controllers/platformController/codeforces/link.js"

const router = express.Router()

router.get("/login",login);
router.post("/signup",signup);
router.get("/google-login",googleLogin);
router.get("/sync",syncDashboard);
router.get("/sync-leetcode",syncLeetCodeManual);
router.get("/sync-codeforces",syncCodeforces);
router.get("/get-codeforces",getCodeforcesDetails);
router.post("/link-codeforces",linkCodeforces);

export default router