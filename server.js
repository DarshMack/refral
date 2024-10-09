import express from 'express';
import cluster from 'cluster';
import os from 'os';
import dotenv from 'dotenv';
import userRoutes from './module/routes/userroutes.js';

dotenv.config();

const app = express();
const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    app.use(express.json());
    app.use('/api', userRoutes);

    app.listen(process.env.PORT || 3000, () => {
        console.log(`Worker ${process.pid} is running on port ${process.env.PORT || 3000}`);
    });
}
