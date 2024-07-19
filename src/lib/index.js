// pages/api/index.js
import { connectToDatabase } from './db';
import mainRouter from '../../routes'; // Adjust import path as needed

export default async function handler(req, res) {
    try {
        // Connect to MongoDB
        await connectToDatabase();

        // Implement CORS handling if needed
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        // Route requests to mainRouter
        mainRouter(req, res);
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
