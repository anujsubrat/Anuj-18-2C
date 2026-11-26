const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));

const SELLER_PASSWORD = 'seller123';   // demo master-panel password
let products = [
  { id: 1, name: 'Wireless Headphones', price: 1999, description: 'Over-ear, 20h battery' },
  { id: 2, name: 'Smart Watch', price: 3499, description: 'Heart-rate and sleep tracking' },
  { id: 3, name: 'Backpack', price: 1299, description: 'Water resistant, 25L' }
];
let orders = [];
let nextProductId = 4, nextOrderId = 1001;

const isSeller = (req, res, next) =>
  req.get('x-seller-password') === SELLER_PASSWORD ? next() : res.status(401).json({ error: 'Seller login required' });

app.get('/api/products', (req, res) => res.json(products));

// Seller master panel
app.post('/api/products', isSeller, (req, res) => {
  const { name, price, description } = req.body;
  if (!name || !(price > 0)) return res.status(400).json({ error: 'Valid name and price required' });
  const p = { id: nextProductId++, name, price: +price, description: description || '' };
  products.push(p); res.status(201).json(p);
});
app.put('/api/products/:id', isSeller, (req, res) => {
  const p = products.find(x => x.id === +req.params.id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  const { name, price, description } = req.body;
  if (name) p.name = name; if (price > 0) p.price = +price; if (description !== undefined) p.description = description;
  res.json(p);
});
app.delete('/api/products/:id', isSeller, (req, res) => {
  products = products.filter(x => x.id !== +req.params.id); res.json({ ok: true });
});

// Checkout with a MOCK payment system (no real money; validates card format only)
app.post('/api/checkout', (req, res) => {
  const { items, payment } = req.body;
  if (!Array.isArray(items) || !items.length) return res.status(400).json({ error: 'Cart is empty' });
  const card = String((payment && payment.card) || '').replace(/\s/g, '');
  if (!payment || !payment.name || !/^\d{16}$/.test(card) || !/^\d{3}$/.test(payment.cvv || ''))
    return res.status(402).json({ error: 'Payment failed: enter name, 16-digit card and 3-digit CVV' });
  let total = 0; const lines = [];
  for (const it of items) {
    const p = products.find(x => x.id === it.id);
    if (!p) return res.status(400).json({ error: 'Product no longer available' });
    const qty = Math.max(1, parseInt(it.qty) || 1);
    total += p.price * qty; lines.push({ name: p.name, price: p.price, qty });
  }
  const order = { id: nextOrderId++, items: lines, total, card: '**** ' + card.slice(-4), date: new Date().toLocaleString(), status: 'PAID' };
  orders.unshift(order);
  res.status(201).json(order);
});
app.get('/api/orders', (req, res) => res.json(orders));

app.listen(3000, () => console.log('Shop running at http://localhost:3000'));
