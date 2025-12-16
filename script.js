document.addEventListener('DOMContentLoaded', function () {
  const btn1 = document.getElementById('btn-1');
  const btn2 = document.getElementById('btn-2');
  const p1 = document.getElementById('plantel-1');
  const p2 = document.getElementById('plantel-2');

  function showPlantel(n) {
    if (n === 1) {
      p1.style.display = '';
      p2.style.display = 'none';
      btn1.classList.add('active');
      btn2.classList.remove('active');
    } else {
      p1.style.display = 'none';
      p2.style.display = '';
      btn1.classList.remove('active');
      btn2.classList.add('active');
    }
  }

  btn1.addEventListener('click', () => showPlantel(1));
  btn2.addEventListener('click', () => showPlantel(2));

  // inicial
  showPlantel(1);
});
