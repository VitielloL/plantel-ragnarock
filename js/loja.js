document.addEventListener('DOMContentLoaded', function () {
  const shopGrid = document.getElementById('shop-grid');
  const sortBtn = document.getElementById('sort-date-btn');
  let newestFirst = true;
  let shopItems = [];

  function formatNumber(n) {
    return n.toLocaleString('pt-BR');
  }

  function preencherDatas() {
    document.querySelectorAll('.shop-card').forEach(card => {
      const dateIso = card.dataset.date;
      const infoP = card.querySelector('.shop-info .date');
      if (!infoP || !dateIso) return;

      const d = new Date(dateIso);
      if (isNaN(d)) {
        infoP.remove();
        return;
      }

      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      infoP.textContent = `Data: ${dd}/${mm}/${yyyy}`;
    });
  }

  function renderShop(items) {
    shopGrid.innerHTML = '';

    items.forEach(item => {
      const perPerson = Math.floor(item.value / item.participants.length);

      const card = document.createElement('div');
      card.className = 'shop-card';
      card.dataset.date = item.date;

      card.innerHTML = `
        <img src="${item.image}" alt="Item da loja">
        <div class="shop-info">
          <p class="date"></p>

          <div class="controls">
            <span class="value">${item.value / 1000000}kk</span>

            <span class="icon info-icon" tabindex="0">i
              <span class="tooltip">
                ${item.participants.map(p => `<span>${p}</span>`).join('')}
              </span>
            </span>

            <span class="icon split-icon" tabindex="0">÷
              <span class="tooltip">
                Divisão: ${formatNumber(perPerson)} zenys por pessoa (${item.participants.length} participantes)
              </span>
            </span>
          </div>
        </div>
      `;

      shopGrid.appendChild(card);
    });

    preencherDatas();
  }

  function sortShopByDate(newest) {
    const sorted = [...shopItems].sort((a, b) => {
      return newest
        ? Date.parse(b.date) - Date.parse(a.date)
        : Date.parse(a.date) - Date.parse(b.date);
    });

    renderShop(sorted);
  }

  if (sortBtn) {
    sortBtn.addEventListener('click', () => {
      newestFirst = !newestFirst;
      sortShopByDate(newestFirst);
      sortBtn.textContent = newestFirst
        ? 'Ordenar: Mais recentes'
        : 'Ordenar: Mais antigos';
    });
  }

  fetch('data/shop-items.json')
    .then(res => res.json())
    .then(data => {
      shopItems = data;
      sortShopByDate(true);
    })
    .catch(err => console.error('Erro ao carregar loja:', err));
});
