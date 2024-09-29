import dbConnect from '../utils/dbConnect';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Cors from 'cors';

const cors = Cors({
    origin: 'https://movie-app-frontend-xi.vercel.app/',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
});

const runMiddleware = (req, res, fn) => {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
};

export default async function handler(req, res) {
    await runMiddleware(req, res, cors); // Ensure CORS is set up first

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', 'https://movie-app-frontend-xi.vercel.app/');
        res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return res.status(204).end(); // No content
    }

    console.log("Start processing request");
    await dbConnect();
    console.log("Database connected");


    if (req.method === 'POST') {
        const { username, email, password } = req.body;
        console.log("Received data:", { username, email });

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ username, email, password: hashedPassword });
            await newUser.save();

            // Generate a token after successful signup
            const token = jwt.sign({ userId: newUser._id }, "867452886f9520fdb7ba8721bf6d46ebc6b000123fb2bef4cb64d32407d86986", {
                expiresIn: '1h',
            });

            res.status(201).json({ message: 'User created successfully', token });
        } catch (err) {
            console.error('Error during registration:', err);
            res.status(500).json({ error: err.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}