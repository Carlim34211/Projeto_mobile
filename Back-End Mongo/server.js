require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://192.168.0.16:8081', // IP do seu Expo ou frontend
    credentials: true,
}));

// Conexão com o MongoDB
connectDB();

// Rotas
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/products', require('./src/routes/productRoutes'));
app.use('/api/restaurants', require('./src/routes/restaurantsRoutes')); // Nova rota para restaurantes

// Porta do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));