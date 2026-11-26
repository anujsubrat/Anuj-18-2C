const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
app.use(express.static('public'));

// Change this if you use MongoDB Atlas
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/labdb';

const Product = mongoose.model('Product', new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: '' }
}, { timestamps: true }));

// CREATE
app.post('/products', async (req, res) => {
  try { res.status(201).json(await Product.create(req.body)); }
  catch (e) { res.status(400).json({ error: e.message }); }
});
// READ all
app.get('/products', async (req, res) => res.json(await Product.find().sort({ createdAt: -1 })));
// READ one
app.get('/products/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    p ? res.json(p) : res.status(404).json({ error: 'Not found' });
  } catch (e) { res.status(400).json({ error: 'Invalid id' }); }
});
// UPDATE
app.put('/products/:id', async (req, res) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    p ? res.json(p) : res.status(404).json({ error: 'Not found' });
  } catch (e) { res.status(400).json({ error: e.message }); }
});
// DELETE
app.delete('/products/:id', async (req, res) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    p ? res.json(p) : res.status(404).json({ error: 'Not found' });
  } catch (e) { res.status(400).json({ error: 'Invalid id' }); }
});

mongoose.connect(MONGO_URI)
  .then(() => { console.log('MongoDB connected'); app.listen(3000, () => console.log('http://localhost:3000')); })
  .catch(err => console.error('MongoDB connection error:', err.message));
