require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, getMongoStatus } = require('./config/db');
const { ensureSeeded } = require('./utils/store');

const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CarBazaar API',
    storage: getMongoStatus() ? 'mongodb' : 'local-json'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

async function startServer() {
  await connectDB();
  await ensureSeeded();
  app.listen(PORT, () => {
    console.log(`CarBazaar backend running on http://localhost:${PORT}`);
  });
}

startServer();
