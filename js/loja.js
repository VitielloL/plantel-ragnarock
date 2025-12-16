document.addEventListener('DOMContentLoaded', () => {
  const shopGrid = document.getElementById('shop-grid');
  const sortBtn = document.getElementById('sort-date-btn');

  let newestFirst = true;
  let shopItems = [];

  function formatNumber(n) {
    return n.toLocaleString('pt-BR');
  }

  // 🔒 Render seguro
  function renderShop(items) {
    shopGrid.innerHTML = '';

    items.forEach(item => {
      if (
        !item.image ||
        !item.date ||
        typeof item.value !== 'number' ||
        !Array.isArray(item.participants)
      ) return;

      const perPerson = Math.floor(item.value / item.participants.length);

      const card = document.createElement('div');
      card.className = 'shop-card';
      card.dataset.date = item.date;

      // parse manual da data (SEM timezone)
      const [yyyy, mm, dd] = item.date.split('-');

      card.innerHTML = `
        <img src="${item.image}" alt="Item da loja">

        <div class="shop-info">
          <p class="date">Data: ${dd}/${mm}/${yyyy}</p>

          <div class="controls">
            <span class="value">${item.value / 1000000}kk</span>

            <span class="icon info-icon" tabindex="0">i
              <span class="tooltip">
                ${[...new Set(item.participants)]
                  .map(p => `<span>${p}</span>`)
                  .join('')}
              </span>
            </span>

            <span class="icon split-icon" tabindex="0">÷
              <span class="tooltip">
                Divisão: ${formatNumber(perPerson)} zenys por pessoa
                (${item.participants.length} participantes)
              </span>
            </span>
          </div>
        </div>
      `;

      shopGrid.appendChild(card);
    });
  }

  function sortShopByDate(newest) {
    const sorted = [...shopItems].sort((a, b) =>
      newest
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date)
    );

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
      shopItems = Array.isArray(data) ? data : [];
      sortShopByDate(true);
    })
    .catch(err => console.error('Erro ao carregar loja:', err));
});
