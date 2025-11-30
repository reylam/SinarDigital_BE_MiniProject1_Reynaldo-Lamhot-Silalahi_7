import express from "express";
import {
  login,
  logout,
  getUsers,
  getUserProfile,
  updateUserStatus,
  getTasks,
  createTask,
  updateTask,
  getJobs,
  createJob,
  getJobSeekers,
  createJobSeeker,
  getDashboard,
  getJobSeekersByJobId,
} from "../controllers/apiController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import {
  validateLogin,
  validateTask,
  validateJob,
} from "../middlewares/validator.js";

const router = express.Router();

router.post("/login", validateLogin, login);
router.post("/logout", authenticate, logout);

router.get("/users", authenticate, authorize(["manage_users"]), getUsers);
router.get("/users/me", authenticate, getUserProfile);
router.put("/users/:id/status", authenticate, updateUserStatus);

router.get("/tasks", authenticate, getTasks);
router.post("/tasks", authenticate, validateTask, createTask);
router.put("/tasks/:id", authenticate, updateTask);

router.get("/jobs", getJobs);
router.post(
  "/jobs",
  authenticate,
  authorize(["manage_jobs"]),
  validateJob,
  createJob
);

router.get(
  "/job-seekers",
  authenticate,
  authorize(["review_applicants"]),
  getJobSeekers
);
router.get(
  "/jobs/:jobId/applicants",
  authenticate,
  authorize(["review_applicants"]),
  getJobSeekersByJobId
);

router.post("/job-seekers", createJobSeeker);

router.get(
  "/reports/dashboard",
  authenticate,
  authorize(["view_reports"]),
  getDashboard
);

export default router;
