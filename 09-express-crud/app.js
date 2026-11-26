const express = require('express');
const app = express();
app.use(express.json());

let products = [
  { id: 1, name: 'Laptop', price: 55000, description: 'Lightweight 14-inch laptop' },
  { id: 2, name: 'Phone', price: 20000, description: 'Android smartphone' }
];
let nextId = 3;

// CREATE
app.post('/products', (req, res) => {
  const { name, price, description } = req.body;
  if (!name || price == null) return res.status(400).json({ error: 'name and price are required' });
  const p = { id: nextId++, name, price: Number(price), description: description || '' };
  products.push(p);
  res.status(201).json(p);
});
// READ all
app.get('/products', (req, res) => res.json(products));
// READ one
app.get('/products/:id', (req, res) => {
  const p = products.find(x => x.id === +req.params.id);
  p ? res.json(p) : res.status(404).json({ error: 'Product not found' });
});
// UPDATE
app.put('/products/:id', (req, res) => {
  const p = products.find(x => x.id === +req.params.id);
  if (!p) return res.status(404).json({ error: 'Product not found' });
  const { name, price, description } = req.body;
  if (name !== undefined) p.name = name;
  if (price !== undefined) p.price = Number(price);
  if (description !== undefined) p.description = description;
  res.json(p);
});
// DELETE
app.delete('/products/:id', (req, res) => {
  const i = products.findIndex(x => x.id === +req.params.id);
  if (i === -1) return res.status(404).json({ error: 'Product not found' });
  res.json(products.splice(i, 1)[0]);
});

app.listen(3000, () => console.log('CRUD API at http://localhost:3000/products'));
