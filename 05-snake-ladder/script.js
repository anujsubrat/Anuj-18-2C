const ladders = { 2: 38, 7: 14, 8: 31, 15: 26, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 78: 98, 87: 94 };
const snakes  = { 16: 6, 46: 25, 49: 11, 62: 19, 64: 60, 74: 53, 89: 68, 92: 88, 95: 75, 99: 80 };
const pos = [0, 0];       // positions of player 1 and 2 (0 = off board)
let turn = 0, over = false;
const boardEl = document.getElementById('board');
const msg = document.getElementById('msg');

// square number -> grid row/col (zig-zag, 1 at bottom-left)
function cellOf(n) {
  const r = Math.floor((n - 1) / 10);
  const c = r % 2 === 0 ? (n - 1) % 10 : 9 - ((n - 1) % 10);
  return { row: 9 - r, col: c };
}
function buildBoard() {
  boardEl.innerHTML = '';
  const cells = [];
  for (let n = 1; n <= 100; n++) {
    const { row, col } = cellOf(n);
    const d = document.createElement('div');
    d.className = 'cell ' + ((row + col) % 2 ? 'a' : 'b');
    d.style.gridRow = row + 1; d.style.gridColumn = col + 1;
    d.textContent = n;
    if (ladders[n]) { d.classList.add('ladder'); d.innerHTML += `<span class="tag">🪜→${ladders[n]}</span>`; }
    if (snakes[n])  { d.classList.add('snake');  d.innerHTML += `<span class="tag">🐍→${snakes[n]}</span>`; }
    d.id = 'c' + n;
    boardEl.appendChild(d);
  }
}
function drawTokens() {
  document.querySelectorAll('.tok').forEach(t => t.remove());
  pos.forEach((p, i) => {
    if (p < 1) return;
    const t = document.createElement('div');
    t.className = 'tok t' + (i + 1);
    document.getElementById('c' + p).appendChild(t);
  });
  document.getElementById('turn').textContent = over ? 'Game over' : `Player ${turn + 1}'s turn`;
}
function roll() {
  if (over) return;
  const d = Math.floor(Math.random() * 6) + 1;
  document.getElementById('dice').textContent = ['⚀','⚁','⚂','⚃','⚄','⚅'][d - 1];
  let text = `Player ${turn + 1} rolled ${d}. `;
  let np = pos[turn] + d;
  if (np > 100) { text += 'Need exact roll.'; }
  else {
    pos[turn] = np;
    if (ladders[np]) { text += `Ladder! ${np} → ${ladders[np]}.`; pos[turn] = ladders[np]; }
    else if (snakes[np]) { text += `Snake! ${np} → ${snakes[np]}.`; pos[turn] = snakes[np]; }
    if (pos[turn] === 100) { over = true; text = `🎉 Player ${turn + 1} wins!`; }
  }
  msg.textContent = text;
  if (!over) turn = 1 - turn;
  drawTokens();
}
function reset() { pos[0] = pos[1] = 0; turn = 0; over = false; msg.textContent = ''; drawTokens(); }
document.getElementById('roll').onclick = roll;
document.getElementById('reset').onclick = reset;
buildBoard(); drawTokens();
