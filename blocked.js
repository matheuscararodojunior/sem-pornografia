'use strict';
const q = new URLSearchParams(location.search);
const why = document.getElementById('why');
if (q.get('h')) {
  why.append('Site: ', Object.assign(document.createElement('code'), { textContent: q.get('h') }));
  if (q.get('r')) why.append(' — motivo: ', Object.assign(document.createElement('code'), { textContent: q.get('r') }));
} else {
  why.textContent = 'Site da lista de sites pornôs conhecidos.';
}
document.getElementById('back').addEventListener('click', () => {
  // O bloqueio substitui a entrada do site no histórico, então voltar 1 cai na página anterior.
  if (history.length > 1) history.back();
  else location.href = 'about:blank';
});
