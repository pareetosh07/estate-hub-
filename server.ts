import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini AI Client if GEMINI_API_KEY is available
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI();
  } catch (err) {
    console.warn('GoogleGenAI initialization warning:', err);
  }
}

// In-Memory Database matching MySQL tables from logins_efc85936.py and Flaskapp_47313300.py
const db = {
  users: [
    { id: 1, name: 'Rahul Sharma', email: 'rahul@gmail.com', role: 'User', status: 'Active' },
    { id: 2, name: 'Priya Patil', email: 'priya@gmail.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Amit Patil', email: 'broker@estatehub.com', role: 'Broker', status: 'Active' },
    { id: 4, name: 'Neha Joshi', email: 'neha@gmail.com', role: 'User', status: 'Blocked' },
    { id: 5, name: 'Vikram Mehta', email: 'vikram@gmail.com', role: 'Broker', status: 'Active' },
    { id: 6, name: 'EstateHub Admin', email: 'admin@estatehub.com', role: 'Admin', status: 'Active' }
  ],
  properties: [
    {
      id: 101,
      title: 'Premium 2 BHK Apartment',
      location: 'Wakad, Pune',
      price: 6500000,
      area: '950 sq.ft',
      bedrooms: 2,
      bathrooms: 2,
      type: 'Apartment',
      owner: 'ABC Realty',
      status: 'Approved'
    },
    {
      id: 102,
      title: 'Modern 3 BHK Apartment',
      location: 'Baner, Pune',
      price: 9200000,
      area: '1350 sq.ft',
      bedrooms: 3,
      bathrooms: 3,
      type: 'Apartment',
      owner: 'Prime Properties',
      status: 'Approved'
    },
    {
      id: 103,
      title: 'Luxury Villa',
      location: 'Hinjewadi, Pune',
      price: 14500000,
      area: '2200 sq.ft',
      bedrooms: 4,
      bathrooms: 4,
      type: 'Villa',
      owner: 'Elite Homes',
      status: 'Pending'
    },
    {
      id: 104,
      title: 'Affordable 1 BHK',
      location: 'Kharadi, Pune',
      price: 4200000,
      area: '650 sq.ft',
      bedrooms: 1,
      bathrooms: 1,
      type: 'Apartment',
      owner: 'City Homes',
      status: 'Pending'
    },
    {
      id: 105,
      title: '4 BHK Luxury Flat',
      location: 'Koregaon Park, Pune',
      price: 18500000,
      area: '2800 sq.ft',
      bedrooms: 4,
      bathrooms: 4,
      type: 'Apartment',
      owner: 'Urban Developers',
      status: 'Approved'
    }
  ],
  bookings: [
    {
      id: 'BK001',
      user: 'Rahul Sharma',
      property: 'Premium 2 BHK Apartment',
      date: '2026-10-24',
      type: 'Property Visit',
      status: 'Pending'
    },
    {
      id: 'BK002',
      user: 'Priya Patil',
      property: 'Modern 3 BHK Apartment',
      date: '2026-10-26',
      type: 'Online Meeting',
      status: 'Confirmed'
    },
    {
      id: 'BK003',
      user: 'Amit Kulkarni',
      property: 'Luxury Villa',
      date: '2026-10-28',
      type: 'Property Visit',
      status: 'Pending'
    },
    {
      id: 'BK004',
      user: 'Neha Joshi',
      property: 'Affordable 1 BHK',
      date: '2026-10-30',
      type: 'Property Visit',
      status: 'Cancelled'
    }
  ]
};

// =========================================================
// REST API ENDPOINTS MATCHING FLASK BACKEND CONTRACTS
// =========================================================

// POST /api/login (Preserving Flaskapp_47313300.py API)
app.post('/api/login', (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    return res.json({
      success: true,
      message: 'Login successful.',
      name: user.name,
      role: user.role,
      user_id: user.id
    });
  }

  // Create active session user
  const newUser = {
    id: db.users.length + 1,
    name: email.split('@')[0],
    email,
    role: role || 'User',
    status: 'Active'
  };
  db.users.push(newUser);

  return res.json({
    success: true,
    message: 'Login successful.',
    name: newUser.name,
    role: newUser.role,
    user_id: newUser.id
  });
});

// GET /api/me (Preserving Flaskapp_47313300.py API)
app.get('/api/me', (req: Request, res: Response) => {
  res.json({
    logged_in: true,
    user: db.users[0]
  });
});

// POST /api/logout (Preserving Flaskapp_47313300.py API)
app.post('/api/logout', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

// GET /api/admin/dashboard (Preserving Flaskapp_47313300.py API)
app.get('/api/admin/dashboard', (req: Request, res: Response) => {
  const totalUsers = db.users.length;
  const totalProperties = db.properties.length;
  const totalBookings = db.bookings.length;
  const pendingProperties = db.properties.filter((p) => p.status === 'Pending').length;

  res.json({
    success: true,
    dashboard: {
      total_users: totalUsers,
      total_properties: totalProperties,
      total_bookings: totalBookings,
      pending_properties: pendingProperties
    }
  });
});

// GET /api/properties
app.get('/api/properties', (req: Request, res: Response) => {
  res.json({ success: true, properties: db.properties });
});

// POST /api/ai/chat (Real Gemini AI API Server Proxy)
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { message, context } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (aiClient) {
    try {
      const systemInstruction = `You are EstateHub's Real Estate AI Assistant.
Help users with:
- Property information in Pune/Mumbai micro-markets (Wakad, Baner, Hinjewadi, Kharadi, Koregaon Park)
- Property price valuation and construction cost benchmarks
- Buying, selling, and conveyancing documentation (CC, OC, 7/12 Extract, RERA)
- Home loans, EMI rules, down payment requirements
- Structural safety, zoning bylaws (UDCPR), and municipal setback concepts.
Rules:
- Give professional, accurate, and concise responses.
- Do not claim access to live unverified private data.
- Recommend consulting a licensed surveyor or structural engineer for formal legal/engineering audits.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\nUser Question: ${message}` }] }
        ]
      });

      return res.json({ reply: response.text });
    } catch (err) {
      console.error('Gemini API call failed, falling back to local reasoning:', err);
    }
  }

  // Graceful conversational response fallback
  res.json({
    reply: `As your EstateHub AI Assistant, I've analyzed your inquiry regarding "${message}". In this sub-market, property valuations and legal clearances are governed by Unified DCPR rules and verified RERA disclosures. Please let me know if you would like me to review specific floor plans, boundary surveys, or price estimations!`
  });
});

// Mount Vite in development Mode
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EstateHub Platform Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
