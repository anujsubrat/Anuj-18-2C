const $ = id => document.getElementById(id);
let products = [], cart = [], sellerPw = null;

// ---- tabs ----
document.querySelectorAll('header button').forEach(b => b.onclick = () => {
  document.querySelectorAll('header button').forEach(x => x.classList.remove('on')); b.classList.add('on');
  ['shop', 'cart', 'orders', 'seller'].forEach(t => $(t).classList.toggle('hide', t !== b.dataset.t));
  if (b.dataset.t === 'orders') loadOrders();
  if (b.dataset.t === 'cart') renderCart();
});
const rs = n => '₹' + n.toLocaleString('en-IN');
const txt = (tag, text, cls) => { const e = document.createElement(tag); e.textContent = text; if (cls) e.className = cls; return e; };

// ---- products ----
async function loadProducts() { products = await (await fetch('/api/products')).json(); renderProducts(); renderPanel(); }
function renderProducts() {
  $('products').innerHTML = '';
  products.forEach(p => {
    const c = document.createElement('div'); c.className = 'card';
    const btn = txt('button', 'Add to Cart', 'p'); btn.onclick = () => addToCart(p.id);
    c.append(txt('h3', p.name), txt('p', p.description), txt('p', rs(p.price), 'price'), btn);
    $('products').appendChild(c);
  });
}

// ---- cart ----
function addToCart(id) {
  const it = cart.find(x => x.id === id);
  it ? it.qty++ : cart.push({ id, qty: 1 });
  $('cc').textContent = cart.reduce((s, x) => s + x.qty, 0);
}
function renderCart() {
  const box = $('cartBox'); box.innerHTML = '';
  cart = cart.filter(i => products.some(p => p.id === i.id));
  if (!cart.length) { box.appendChild(txt('p', 'Your cart is empty.')); $('payBox').classList.add('hide'); return; }
  $('payBox').classList.remove('hide');
  const t = document.createElement('table');
  t.innerHTML = '<tr><th>Item</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr>';
  let total = 0;
  cart.forEach(i => {
    const p = products.find(x => x.id === i.id); total += p.price * i.qty;
    const tr = document.createElement('tr');
    const minus = txt('button', '−', 'p'), plus = txt('button', '+', 'p'), del = txt('button', 'Remove', 'p r');
    minus.onclick = () => { i.qty = Math.max(1, i.qty - 1); upd(); };
    plus.onclick = () => { i.qty++; upd(); };
    del.onclick = () => { cart = cart.filter(x => x !== i); upd(); };
    const q = document.createElement('td'); q.append(minus, ' ' + i.qty + ' ', plus);
    const a = document.createElement('td'); a.appendChild(del);
    tr.append(txt('td', p.name), txt('td', rs(p.price)), q, txt('td', rs(p.price * i.qty)), a);
    t.appendChild(tr);
  });
  box.append(t, txt('h3', 'Total: ' + rs(total)));
}
function upd() { $('cc').textContent = cart.reduce((s, x) => s + x.qty, 0); renderCart(); }

$('pay').onclick = async () => {
  const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: cart, payment: { name: $('cn').value, card: $('cardn').value, cvv: $('cvv').value } }) });
  const data = await res.json();
  $('payMsg').className = 'msg ' + (res.ok ? 'ok' : 'err');
  if (res.ok) { $('payMsg').textContent = `Order #${data.id} placed successfully!`; cart = []; upd(); $('cn').value = $('cardn').value = $('cvv').value = ''; }
  else $('payMsg').textContent = data.error;
};

// ---- orders ----
async function loadOrders() {
  const list = await (await fetch('/api/orders')).json(), box = $('ordersBox'); box.innerHTML = '';
  if (!list.length) return box.appendChild(txt('p', 'No orders yet.'));
  list.forEach(o => {
    const d = document.createElement('div'); d.className = 'box';
    d.append(txt('h3', `Order #${o.id} - ${o.status}`), txt('small', `${o.date} | Card ${o.card}`));
    const ul = document.createElement('ul');
    o.items.forEach(i => ul.appendChild(txt('li', `${i.name} x ${i.qty} = ${rs(i.price * i.qty)}`)));
    d.append(ul, txt('b', 'Total: ' + rs(o.total))); box.appendChild(d);
  });
}

// ---- seller master panel ----
const sh = () => ({ 'Content-Type': 'application/json', 'x-seller-password': sellerPw });
$('slogin').onclick = async () => {
  sellerPw = $('spw').value;
  const r = await fetch('/api/products', { method: 'POST', headers: sh(), body: '{}' });
  if (r.status === 401) { $('lmsg').className = 'msg err'; $('lmsg').textContent = 'Wrong password'; sellerPw = null; return; }
  $('login').classList.add('hide'); $('panel').classList.remove('hide'); renderPanel();
};
function renderPanel() {
  if (!sellerPw) return; $('ptbl').innerHTML = '';
  products.forEach(p => {
    const tr = document.createElement('tr');
    const e = txt('button', 'Edit', 'p'), d = txt('button', 'Delete', 'p r');
    e.onclick = () => { $('pid').value = p.id; $('pn').value = p.name; $('pp').value = p.price; $('pd').value = p.description; $('fh').textContent = 'Edit Product'; };
    d.onclick = async () => { await fetch('/api/products/' + p.id, { method: 'DELETE', headers: sh() }); loadProducts(); };
    const a = document.createElement('td'); a.append(e, d);
    tr.append(txt('td', p.name), txt('td', rs(p.price)), a); $('ptbl').appendChild(tr);
  });
}
$('psave').onclick = async () => {
  const id = $('pid').value, body = JSON.stringify({ name: $('pn').value, price: +$('pp').value, description: $('pd').value });
  const r = await fetch(id ? '/api/products/' + id : '/api/products', { method: id ? 'PUT' : 'POST', headers: sh(), body });
  if (!r.ok) return alert((await r.json()).error);
  clearForm(); loadProducts();
};
function clearForm() { ['pid', 'pn', 'pp', 'pd'].forEach(i => $(i).value = ''); $('fh').textContent = 'Add Product'; }
$('pcancel').onclick = clearForm;
loadProducts();
