require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const path = require('path');
const connectDB = require('./config/db');
const flashMiddleware = require('./middleware/flash');

// Route imports
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const adminRoutes = require('./routes/admin');
const residentRoutes = require('./routes/resident');
const profileRoutes = require('./routes/profile');

const app = express();

// Connect to MongoDB
connectDB();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Method override for PUT/DELETE via forms
app.use(methodOverride('_method'));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'hotel_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 60 * 60 * 24, // 1 day
    autoRemove: 'native'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Flash + user locals middleware
app.use(flashMiddleware);

// Routes
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/admin', adminRoutes);
app.use('/resident', residentRoutes);
app.use('/profile', profileRoutes);

// Root redirect
app.get('/', (req, res) => {
  if (req.session && req.session.userId) return res.redirect('/dashboard');
  res.redirect('/auth/login');
});

// 404 handler
app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html><html><head><title>404 Not Found</title>
    <style>
      body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f0f4f8;}
      .box{text-align:center;padding:40px;background:#fff;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.1);}
      h1{font-size:4rem;color:#1a3c5e;margin:0;}
      p{color:#718096;}
      a{color:#2563a8;font-weight:600;}
    </style></head>
    <body><div class="box"><h1>404</h1><p>Page not found.</p><a href="/">Go Home</a></div></body></html>
  `);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`
    <!DOCTYPE html><html><head><title>500 Error</title>
    <style>
      body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f0f4f8;}
      .box{text-align:center;padding:40px;background:#fff;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.1);}
      h1{font-size:4rem;color:#e74c3c;margin:0;}
      p{color:#718096;}
      a{color:#2563a8;font-weight:600;}
    </style></head>
    <body><div class="box"><h1>500</h1><p>Something went wrong on our end.</p><a href="/">Go Home</a></div></body></html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🏨  HotelMS running at http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
