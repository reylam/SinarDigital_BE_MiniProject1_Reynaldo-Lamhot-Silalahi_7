import { loadData, saveData, generateId } from "../utils/helpers.js";

export const login = (req, res) => {
  const { email, password } = req.body;
  const data = loadData();
  const user = data.users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = `token-${user.id}-${Date.now()}`;
  const updatedUsers = data.users.map((u) =>
    u.id === user.id ? { ...u, token, status: "online" } : u
  );

  saveData({ ...data, users: updatedUsers });

  const updatedUser = updatedUsers.find((u) => u.id === user.id);
  const { password: _, token: __, ...safeUser } = updatedUser;

  res.json({
    user: safeUser,
    token,
  });
};

export const logout = (req, res) => {
  const data = loadData();
  const updatedUsers = data.users.map((u) =>
    u.id === req.user.id ? { ...u, token: null, status: "offline" } : u
  );

  saveData({ ...data, users: updatedUsers });
  res.json({ message: "Logout successfully" });
};

export const getUsers = (req, res) => {
  const data = loadData();
  const safeUsers = data.users.map(({ password, token, ...user }) => user);
  res.json(safeUsers);
};

export const getUserProfile = (req, res) => {
  const { password, token, ...user } = req.user;
  res.json(user);
};

export const updateUserStatus = (req, res) => {
  const userId = parseInt(req.params.id);
  const { status } = req.body;

  const data = loadData();
  const userIndex = data.users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  const updatedUsers = [...data.users];
  updatedUsers[userIndex] = { ...updatedUsers[userIndex], status };

  saveData({ ...data, users: updatedUsers });

  const { password, token, ...updatedUser } = updatedUsers[userIndex];
  res.json(updatedUser);
};

export const getTasks = (req, res) => {
  const data = loadData();
  let tasks = [...data.tasks];

  if (req.query.status) {
    tasks = tasks.filter((task) => task.status === req.query.status);
  }

  if (req.query.assigned_to) {
    tasks = tasks.filter((task) => task.assigned_to == req.query.assigned_to);
  }

  res.json(tasks);
};

export const createTask = (req, res) => {
  const { title, description, assigned_to, due_date } = req.body;
  const data = loadData();
  const creator = req.user;

  const newTask = {
    id: generateId(data.tasks),
    title,
    description,
    status: "pending",
    assigned_to,
    created_by: creator.id,
    due_date,
  };

  const updatedTasks = [...data.tasks, newTask];
  saveData({ ...data, tasks: updatedTasks });

  res.status(201).json(newTask);
};

export const updateTask = (req, res) => {
  const taskId = parseInt(req.params.id);
  const data = loadData();
  const taskIndex = data.tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  const updatedTasks = [...data.tasks];
  updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], ...req.body };

  saveData({ ...data, tasks: updatedTasks });
  res.json(updatedTasks[taskIndex]);
};

export const getJobs = (req, res) => {
  const data = loadData();
  let jobs = [...data.jobs];

  if (req.query.status) {
    jobs = jobs.filter((job) => job.status === req.query.status);
  }

  res.json(jobs);
};

export const getJobSeekersByJobId = (req, res) => {
  const { jobId } = req.params;
  const data = loadData();

  const targetJobId = parseInt(jobId);

  const jobSeekers = data.job_seekers.filter(
    (seeker) => seeker.applied_job_id === targetJobId
  );

  const job = data.jobs.find((job) => job.id === targetJobId);
  if (!job) {
    return res.status(404).json({
      error: "Job not found",
      message: `Job with ID ${jobId} does not exist`,
    });
  }

  res.json({
    message: `Job seekers search by jobId successfully`,
    count: jobSeekers.length,
    job_seekers: jobSeekers,
    job: {
      id: job.id,
      title: job.title,
      description: job.description,
    },
  });
};

export const createJob = (req, res) => {
  const { title, description } = req.body;
  const data = loadData();

  const newJob = {
    id: generateId(data.jobs),
    title,
    description,
    status: "open",
    created_by: req.user.id,
  };

  const updatedJobs = [...data.jobs, newJob];
  saveData({ ...data, jobs: updatedJobs });

  res.status(201).json(newJob);
};

export const getJobSeekers = (req, res) => {
  const data = loadData();
  res.json(data.job_seekers);
};

export const createJobSeeker = (req, res) => {
  const { name, email, skills, experience_years, applied_job_id } = req.body;
  const data = loadData();

  const newJobSeeker = {
    id: generateId(data.job_seekers),
    name,
    email,
    skills,
    experience_years,
    applied_job_id,
  };

  const updatedJobSeekers = [...data.job_seekers, newJobSeeker];
  saveData({ ...data, job_seekers: updatedJobSeekers });

  res.status(201).json(newJobSeeker);
};

export const getDashboard = (req, res) => {
  const data = loadData();
  const stats = {
    totalUsers: data.users.length,
    totalTasks: data.tasks.length,
    completedTasks: data.tasks.filter((t) => t.status === "completed").length,
    pendingTasks: data.tasks.filter((t) => t.status === "pending").length,
    totalJobs: data.jobs.length,
    openJobs: data.jobs.filter((j) => j.status === "open").length,
    totalApplicants: data.job_seekers.length,
  };

  res.json(stats);
};
