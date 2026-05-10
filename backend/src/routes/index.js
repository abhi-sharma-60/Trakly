import express from "express"
import login from "../controllers/UserController/login.js"
import signup from "../controllers/UserController/signup.js"
import googleLogin from "../controllers/UserController/googleLogin.js"
import { syncDashboard } from "../controllers/platformController/syncUserStats.js"
import { syncLeetCodeManual } from "../controllers/platformController/leetcode/sync.js"
import { syncCodeforces } from "../controllers/platformController/codeforces/sync.js"
import { getCodeforcesDetails } from "../controllers/platformController/codeforces/getDetails.js"
import { linkCodeforces } from "../controllers/platformController/codeforces/link.js"
import { linkLeetcode } from "../controllers/platformController/leetcode/link.js"
import { generateUserAnalysis } from "../controllers/UserController/analysis.js"
import auth from "../middleware/auth.js"

const router = express.Router()

router.post("/login",login);
router.post("/auth/signup",signup);
router.get("/google-login",googleLogin);

//protected routes
router.get("/sync",auth,syncDashboard);
router.get("/sync-leetcode",auth,syncLeetCodeManual);
router.get("/sync-codeforces",auth,syncCodeforces);
router.get("/get-codeforces",auth,getCodeforcesDetails);
router.post("/link-codeforces",auth,linkCodeforces);
router.post("/link-leetcode",auth,linkLeetcode);
router.get("/get-analysis",auth,generateUserAnalysis);

export default router