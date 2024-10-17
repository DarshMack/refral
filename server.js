import express from "express";
import cluster from "cluster";
import os from "os";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./module/routes/userroutes.js";
import connection from "./config/database.js";

import {
  saveUserData,
  fetchReferralUsers,
  deleteUser,
  updateProfile,
} from "./module/controllers/usercontroller.js";

dotenv.config();

const app = express();
const numCPUs = os.cpus().length;

// Configuring __dirname for ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  app.use(express.json());
  app.use("/api", userRoutes);

  // Serve static files
  app.use(express.static(path.join(__dirname, "public")));

  // Multer setup for handling file uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to avoid file conflicts
    },
  });

  const upload = multer({ storage });

  // Render the form HTML
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
  });

  // Route to handle form submission
  app.post("/submit", upload.array("profilePic", 5), async (req, res) => {
    const { name, mobile, referralCode, gender, dob } = req.body;
    const profilePics = req.files.map((file) => file.filename);
    req.body.profilePic = profilePics;
    try {
      const result = await saveUserData(req, res);
      res.status(200).json({ message: "User added successfully", result });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error });
    }
  });

  // Route to fetch all users' data
  app.get("/users", (req, res) => {
    const sql = "SELECT * FROM tbl_user";
    connection.query(sql, (err, results) => {
      if (err) return res.status(500).send("Error fetching data");
      res.json(results);
    });
  });

  app.listen(process.env.PORT || 3000, () => {
    console.log(
      `Worker ${process.pid} is running on port ${process.env.PORT || 3000}`
    );
  });
}
