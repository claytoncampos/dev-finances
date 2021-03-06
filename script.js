//seletores//
const modal = document.querySelector('.modal-overlay');
const nightMode = document.querySelector('#switch-shadow');

//darkMode
nightMode.addEventListener('click', () => {
  // adiciona a classe `night-mode` ao html
  document.documentElement.classList.toggle('night-mode');
  document.querySelector('header').classList.toggle('night-mode');
  document.querySelector('body').classList.toggle('night-mode');
});

//Modal
const isOpenModal = () => modal.classList.toggle('active');

//----------Utilizadades - Formatadores -------
const Utils = {
  formatDate(date) {
    const splittedDate = date.split('-');
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },
  formatAmount(value) {
    // value = Number(value.replace(/\,\./g, "")) * 100
    value = Number(value) * 100;
    return value;
  },
  formatCurrency(value) {
    const fundo = document.querySelector('.card.total');
    const update = () => fundo.classList.toggle('negative')
    const signal = Number(value) < 0 ? '-' : '';

    value = String(value).replace(/\D/g, '');

    value = Number(value) / 100;
   
    value = value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }); 
    
    return signal + value;

  },
  formatDisplayColor(){
  const cardTotal = document.querySelector('.card.total')
   const valorCardTotal = document.querySelector('#totalDisplay').textContent;
   console.log(valorCardTotal)
   if(valorCardTotal.indexOf('-')> -1){
    cardTotal.classList.toggle('negative')}
  },
  formatBackground() {
    update();
  },
};

//---------LocalStorage--------
const Storage = {
  get() {
    return JSON.parse(localStorage.getItem('dev.finances:transactions')) || [];
  },

  set(transactions) {
    localStorage.setItem(
      'dev.finances:transactions',
      JSON.stringify(transactions)
    );
  },
};

/*transacoes simbolicas
const transactions = [
  {
    description: 'Luz',
    amount: -50000,
    date: '03/02/2021',
  },
  {
    description: 'Website',
    amount: 500000,
    date: '03/02/2021',
  },
  {
    description: 'Internet',
    amount: -20000,
    date: '03/02/2021',
  },
];
*/

//------------Transações--------
const Transaction = {
  all: Storage.get(),
  /* objeto exmplo[
    {
      description: 'Luz',
      amount: -50000,
      date: '03/02/2021',
    },
    {
      description: 'Website',
      amount: 500000,
      date: '03/02/2021',
    },
    {
      description: 'Internet',
      amount: -20000,
      date: '03/02/2021',
    },
  ]*/

  add(transaction) {
    Transaction.all.push(transaction);

    App.reload();
  },

  remove(index) {
    Transaction.all.splice(index, 1);

    App.reload();
  },

  incomes() {
    let income = 0;
    //somar as entradas pegar todas as transacoes para cada transacao, se ela for > 0 somar em uma variavel e retornar a variavel
    Transaction.all.forEach((transaction) => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      }
    });
    return income;
  },

  expenses() {
    // somar as saídas | pegar todas as transacoes | para cada transacao, se ela for < 0 |//somar em uma variavel e retornar a variavel
    let expense = 0;
    Transaction.all.forEach((transaction) => {
      if (transaction.amount < 0) {
        expense += transaction.amount;
      }
    });
    return expense;
  },

  total() {
    // entradas - saidas

    const totalTransactions = Transaction.incomes() + Transaction.expenses();
    console.log(totalTransactions);
   
    
      return totalTransactions;
    
  },
};

//-------DOM ------------

const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {
    const tr = document.createElement('tr');
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;

    DOM.transactionsContainer.appendChild(tr);
  },

  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? 'income' : 'expense';

    const amount = Utils.formatCurrency(transaction.amount);

    const html = `		
			<td class="description">${transaction.description}</td>
			<td class="${CSSclass}">${amount}</td>
			<td class="date">${transaction.date}</td>
			<td>
				<img  class="glow" onclick="Transaction.remove(${index})" src="./assets/minus.svg">
			</td>		
		`;
    return html;
  },

  updateBalance() {
    document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(
      Transaction.incomes()
    );
    document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(
      Transaction.expenses()
    );
    document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(
      Transaction.total()

    );
    Utils.formatDisplayColor()
   
  },

  clearTransaction() {
    DOM.transactionsContainer.innerHTML = '';
  },
};

//------Form ------------
const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    };
  },
  validateFields() {
    const { description, amount, date } = Form.getValues();

    if (
      description.trim() === '' ||
      amount.trim() === '' ||
      date.trim() === ''
    ) {
      throw new Error('Por favor, preencha todos os campos');
    }
  },
  formatValues() {
    let { description, amount, date } = Form.getValues();

    amount = Utils.formatAmount(amount);

    date = Utils.formatDate(date);

    return {
      description,
      amount,
      date,
    };
  },
  saveTransaction(transaction) {
    Transaction.add(transaction);
  },
  clearFields() {
    Form.description.value = '';
    Form.amount.value = '';
    Form.date.value = '';
  },

  submit(event) {
    event.preventDefault();

    try {
      //verfiicar se todas as iformaçoes foram preenchidas
      Form.validateFields();
      //formatar os dados para salvar
      const transaction = Form.formatValues();
      //salvar
      Form.saveTransaction(transaction);
      //limpar formulario
      Form.clearFields();
      //modal feche
      isOpenModal();
      //atualizar a aplicação
      //App.reload();
    } catch (error) {
      alert(error.message);
    }
  },
};

//--------App ----------
const App = {
  init() {



    Transaction.all.forEach((transaction, index) => {
      DOM.addTransaction(transaction, index);
    });

    DOM.updateBalance();


    Storage.set(Transaction.all);
  },

  reload() {
    DOM.clearTransaction();
    Utils.formatDisplayColor()
    App.init();
  },
};

//-----init----------
App.init();




