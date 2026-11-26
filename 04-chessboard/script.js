// All HTML elements are created dynamically and all CSS is applied via JavaScript.
Object.assign(document.body.style, {
  margin: '0', minHeight: '100vh', display: 'flex', flexDirection: 'column',
  alignItems: 'center', justifyContent: 'center', background: '#2c3e50', fontFamily: 'Arial'
});
const title = document.createElement('h1');
title.textContent = 'Chessboard';
title.style.color = '#fff';
document.body.appendChild(title);

const board = document.createElement('div');
Object.assign(board.style, {
  display: 'grid', gridTemplateColumns: 'repeat(8, 60px)', gridTemplateRows: 'repeat(8, 60px)',
  border: '6px solid #8b5a2b', boxShadow: '0 0 20px rgba(0,0,0,.5)'
});
document.body.appendChild(board);

const black = ['♜','♞','♝','♛','♚','♝','♞','♜'];
const white = ['♖','♘','♗','♕','♔','♗','♘','♖'];
for (let r = 0; r < 8; r++) {
  for (let c = 0; c < 8; c++) {
    const sq = document.createElement('div');
    Object.assign(sq.style, {
      width: '60px', height: '60px', display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: '40px',
      background: (r + c) % 2 === 0 ? '#f0d9b5' : '#b58863'
    });
    let piece = '';
    if (r === 0) piece = black[c];
    if (r === 1) piece = '♟';
    if (r === 6) piece = '♙';
    if (r === 7) piece = white[c];
    sq.textContent = piece;
    sq.style.color = '#000';
    board.appendChild(sq);
  }
}
