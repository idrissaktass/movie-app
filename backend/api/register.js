import express from 'express';
import dbConnect from './utils/dbConnect'; // Adjust path as necessary
import User from './models/User'; // Adjust path as necessary
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();

// Set up CORS middleware
app.use(cors({
    origin: 'https://movie-app-frontend-xi.vercel.app', // Allow this frontend to access your API
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Handle the registration endpoint
app.post('/api/register', async (req, res) => {
    try {
        console.log("Connecting to the database...");
        await dbConnect();
        console.log("Database connected");
    } catch (error) {
        console.error("Database connection error:", error);
        return res.status(500).json({ error: "Database connection error" });
    }

    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
        console.error("Missing fields:", { username, email, password });
        return res.status(400).json({ error: "Missing fields" });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id }, "867452886f9520fdb7ba8721bf6d46ebc6b000123fb2bef4cb64d32407d86986", {
            expiresIn: '1h',
        });

        // Respond with success
        res.status(201).json({ message: 'User created successfully', token });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: err.message, stack: err.stack });
    }
});

// Set up the server to listen on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

