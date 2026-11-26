let tasks = [];
const list = document.getElementById('list');
const input = document.getElementById('taskInput');

function render() {
  list.innerHTML = '';
  tasks.forEach((t, i) => {
    const li = document.createElement('li');
    if (t.done) li.className = 'done';
    li.innerHTML = `<input type="checkbox" ${t.done ? 'checked' : ''}>
      <span></span>
      <button class="mv up">&#8593;</button>
      <button class="mv down">&#8595;</button>
      <button class="del">Delete</button>`;
    li.querySelector('span').textContent = t.text;
    li.querySelector('input').onchange = () => { t.done = !t.done; render(); };
    li.querySelector('.up').onclick = () => move(i, -1);
    li.querySelector('.down').onclick = () => move(i, 1);
    li.querySelector('.del').onclick = () => { tasks.splice(i, 1); render(); };
    list.appendChild(li);
  });
}
function move(i, d) {
  const j = i + d;
  if (j < 0 || j >= tasks.length) return;
  [tasks[i], tasks[j]] = [tasks[j], tasks[i]];
  render();
}
function addTask() {
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ text, done: false });
  input.value = '';
  render();
}
document.getElementById('addBtn').onclick = addTask;
input.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });
