const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));

const products = [
  { id: 1, name: 'Keyboard', price: 1499, rating: 4.5 },
  { id: 2, name: 'Mouse', price: 799, rating: 4.2 },
  { id: 3, name: 'Monitor', price: 10999, rating: 4.7 }
];
let nextId = 4;

app.get('/api/products', (req, res) => res.json(products));
app.post('/api/products', (req, res) => {
  const { name, price, rating } = req.body;
  if (!name || isNaN(price) || isNaN(rating)) return res.status(400).json({ error: 'Invalid data' });
  const p = { id: nextId++, name, price: +price, rating: +rating };
  products.push(p);
  res.status(201).json(p);
});
app.listen(3000, () => console.log('http://localhost:3000'));
