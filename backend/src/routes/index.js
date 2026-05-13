import express from "express"
import login from "../controllers/UserController/login.js"
import signup from "../controllers/UserController/signup.js"
import { syncDashboard } from "../controllers/platformController/syncUserStats.js"
import { syncLeetCodeManual } from "../controllers/platformController/leetcode/sync.js"
import { syncCodeforces } from "../controllers/platformController/codeforces/sync.js"
import { getCodeforcesDetails } from "../controllers/platformController/codeforces/getDetails.js"
import { linkCodeforces } from "../controllers/platformController/codeforces/link.js"
import { linkLeetcode } from "../controllers/platformController/leetcode/link.js"
import { generateUserAnalysis } from "../controllers/UserController/analysis.js"
import {codeforcesSse} from "../controllers/platformController/codeforces/cfSseController.js"
import auth from "../middleware/auth.js"
import { logout } from "../controllers/UserController/logout.js"
import { getAnalysis } from "../controllers/UserController/getAnalysis.js"
import { unlinkCodeforces } from "../controllers/platformController/codeforces/unlink.js"
import { unlinkLeetCode } from "../controllers/platformController/leetcode/unlink.js"
import { unlinkAllPlatforms } from "../controllers/platformController/unlink.js"
import { googleLogin } from "../controllers/UserController/googleLogin.js"
import { getAnalyticsData } from "../controllers/platformController/getAnalytics.js"

const router = express.Router()

router.post("/login",login);
router.post("/auth/signup",signup);
router.post("/google-login",googleLogin);

//protected routes
router.get("/sync",auth,syncDashboard);
router.get("/sync-leetcode",auth,syncLeetCodeManual);
router.get("/sync-codeforces",auth,syncCodeforces);
router.get("/get-codeforces",auth,getCodeforcesDetails);
router.post("/link-codeforces",auth,linkCodeforces);
router.post("/link-leetcode",auth,linkLeetcode);
router.get("/get-analysis",auth,generateUserAnalysis);
router.post("/logout",auth,logout);
router.get("/analysis",auth,getAnalysis)
router.delete("/delete-leetcode",auth,unlinkLeetCode)
router.delete("/delete-codeforces",auth,unlinkCodeforces)
router.delete("/delete-all",auth,unlinkAllPlatforms)
router.get('/analytics',auth,getAnalyticsData)


// SSE route for Codeforces sync status
router.get("/codeforcesSse", auth, codeforcesSse);

export default router