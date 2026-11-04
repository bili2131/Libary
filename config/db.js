import dns from 'node:dns';
import mongoose from 'mongoose';

export const db = { users: [] };

export const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error('MONGODB_URI is not set. Copy .env.example to .env and configure it.');
    }

    if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
        throw new Error('MONGODB_URI must start with mongodb:// or mongodb+srv://.');
    }

    const dnsServers = process.env.MONGODB_DNS_SERVERS
        ?.split(',')
        .map((server) => server.trim())
        .filter(Boolean);

    if (dnsServers?.length) {
        dns.setServers(dnsServers);
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
};
