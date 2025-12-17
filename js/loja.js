document.addEventListener('DOMContentLoaded', () => {
  const shopGrid = document.getElementById('shop-grid');
  const sortBtn = document.getElementById('sort-date-btn');
  const participantFilter = document.getElementById('participant-filter');

  let newestFirst = true;
  let shopItems = [];
  let activeParticipant = '';

  function formatNumber(n) {
    return n.toLocaleString('pt-BR');
  }

  /* =======================
     RENDER DA LOJA
  ======================= */
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

      const [yyyy, mm, dd] = item.date.split('-');

      const card = document.createElement('div');
      card.className = 'shop-card';
      card.dataset.date = item.date;

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

  /* =======================
     FILTRO + ORDENAÇÃO
  ======================= */
  function getFilteredItems() {
    let filtered = [...shopItems];

    if (activeParticipant) {
      filtered = filtered.filter(item =>
        item.participants.includes(activeParticipant)
      );
    }

    return filtered.sort((a, b) =>
      newestFirst
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date)
    );
  }

  /* =======================
     POPULAR FILTRO
  ======================= */
  function populateParticipants(items) {
    const allParticipants = new Set();

    items.forEach(item => {
      item.participants.forEach(p => allParticipants.add(p));
    });

    [...allParticipants]
      .sort()
      .forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        participantFilter.appendChild(option);
      });
  }

  /* =======================
     EVENTOS
  ======================= */
  if (sortBtn) {
    sortBtn.addEventListener('click', () => {
      newestFirst = !newestFirst;

      sortBtn.textContent = newestFirst
        ? 'Ordenar: Mais recentes'
        : 'Ordenar: Mais antigos';

      renderShop(getFilteredItems());
    });
  }

  if (participantFilter) {
    participantFilter.addEventListener('change', e => {
      activeParticipant = e.target.value;
      renderShop(getFilteredItems());
    });
  }

  /* =======================
     FETCH DOS ITENS
  ======================= */
  fetch('data/shop-items.json')
    .then(res => res.json())
    .then(data => {
      shopItems = Array.isArray(data) ? data : [];
      populateParticipants(shopItems);
      renderShop(getFilteredItems());
    })
    .catch(err => console.error('Erro ao carregar loja:', err));
});
