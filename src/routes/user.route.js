import { Router } from "express";
import {
  loginUser,
  logout,
  registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/fileUpload.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logout);

export default router;
