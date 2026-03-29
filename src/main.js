document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.calculator__form');
  const resetButton = document.querySelector('.calculator__reset');
  const tipButtons = document.querySelectorAll('.calculator__tip-button');
  const customTipInput = document.getElementById('tip-custom');
  
  const state = {
    bill: 0,
    tip: 0,
    people: 0,
    isCustom: false
  };

  const ui = {
    tipAmount: document.getElementById('tip-amount'),
    totalPerPerson: document.getElementById('total-per-person'),
    peopleError: document.getElementById('people-error'),
    peopleInput: document.getElementById('people'),
    peopleField: document.getElementById('people').closest('.calculator__field')
  };

  const formatCurrency = (val) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

  function calculate() {
    const { bill, tip, people } = state;
    let tipPerPerson = 0;
    let totalPerPerson = 0;

    const isPeopleZero = ui.peopleInput.value !== '' && people === 0;
    ui.peopleError.hidden = !isPeopleZero;
    ui.peopleField.classList.toggle('is-error', isPeopleZero);
    ui.peopleInput.setAttribute('aria-invalid', isPeopleZero);

    if (bill > 0 && people > 0) {
      tipPerPerson = (bill * (tip / 100)) / people;
      totalPerPerson = (bill / people) + tipPerPerson;
    }

    ui.tipAmount.textContent = formatCurrency(tipPerPerson);
    ui.totalPerPerson.textContent = formatCurrency(totalPerPerson);
    
    resetButton.disabled = !bill && !tip && !people;
  }

  form.addEventListener('input', (e) => {
    const target = e.target;
    const val = parseFloat(target.value) || 0;

    if (target.id === 'bill') state.bill = val;
    if (target.id === 'people') state.people = val;
    if (target.id === 'tip-custom') {
      state.tip = val;
      state.isCustom = true;
      tipButtons.forEach(btn => btn.classList.remove('is-active'));
    }

    calculate();
  });

  form.addEventListener('click', (e) => {
    const btn = e.target.closest('.calculator__tip-button');
    if (!btn) return;

    tipButtons.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    
    customTipInput.value = '';
    state.tip = parseFloat(btn.dataset.tip);
    state.isCustom = false;
    
    calculate();
  });

  form.addEventListener('reset', () => {
    setTimeout(() => {
      state.bill = 0;
      state.tip = 0;
      state.people = 0;
      tipButtons.forEach(b => b.classList.remove('is-active'));
      calculate();
    }, 0);
  });
});