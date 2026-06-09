const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend jalan');
});

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();

  res.json(users);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});