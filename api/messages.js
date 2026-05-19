// api/messages.js
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!uri) {
    throw new Error('MongoDB Atlas tidak dapat dikonfirmasi');
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(); // Mengambil database default dari URI

  cachedClient = client;
  cachedDb = db;
  return { client, db };
}

export default async function handler(req, res) {
  // Mengatur Header CORS agar bisa diakses dari frontend dev lokal
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('wishes');

    // 1. HANDLE GET REQUEST (Mengambil semua pesan)
    if (req.method === 'GET') {
      const messages = await collection
        .find({})
        .sort({ createdAt: -1 }) // Urutkan dari yang terbaru
        .limit(100)              // Batasi maksimal 100 pesan
        .toArray();
      
      return res.status(200).json(messages);
    }

    // 2. HANDLE POST REQUEST (Menyimpan pesan baru)
    if (req.method === 'POST') {
      const { name, text } = req.body;

      if (!name || !text) {
        return res.status(400).json({ message: 'Nama dan ucapan wajib diisi' });
      }

      const newMessage = {
        name: name.trim(),
        text: text.trim(),
        createdAt: new Date()
      };

      await collection.insertOne(newMessage);
      return res.status(201).json(newMessage);
    }

    // Jika method tidak diizinkan
    return res.status(405).json({ message: 'Method tidak diizinkan' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
}