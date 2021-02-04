//seletores//
const modal = document.querySelector('.modal-overlay');

/*criando uma função toggle
function toggleModal(){
	if(modal.classList.contains('active')){
		modal.classList.remove('active')
	}else{
		modal.classList.add('active')
	}
}
*/

//arrow function c/ toggle modal
const activeModal = () => modal.classList.toggle('active');

const transactions = [
  {
    id: 1,
    description: 'Luz',
    amount: -50000,
    date: '03/02/2021',
  },
  {
    id: 2,
    description: 'Website',
    amount: 500000,
    date: '03/02/2021',
  },
  {
    id: 3,
    description: 'Internet',
    amount: -20000,
    date: '03/02/2021',
  },
];

const Transaction = {
  all: transactions,
  add(transaction) {
    Transaction.all.push(transaction);
    console.log(Transaction.all);
  },

  incomes() {
    let income = 0;
    //somar as entradas
    //pegar todas as transacoes
    Transaction.all.forEach((transaction) => {
      //para cada transacao, se ela for > 0
      if (transaction.amount > 0) {
        //somar em uma variavel e retornar a variavel
        income += transaction.amount;
      }
    });
    return income;
  },

  expenses() {
    // somar as saídas
    let expense = 0;
    //pegar todas as transacoes
    Transaction.all.forEach((transaction) => {
      //para cada transacao, se ela for < 0
      if (transaction.amount < 0) {
        //somar em uma variavel e retornar a variavel
        expense += transaction.amount;
      }
    });
    return expense;
  },

  total() {
    // entradas - saidas
    return Transaction.incomes() + Transaction.expenses();
  },
};

//substituir os dados HTML para os dados JS
//armazena no objeto transaction

const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {
    const tr = document.createElement('tr');
    tr.innerHTML = DOM.innerHTMLTransaction(transaction);

    DOM.transactionsContainer.appendChild(tr);
  },

  innerHTMLTransaction(transaction) {
    const CSSclass = transaction.amount > 0 ? 'income' : 'expense';

    const amount = Utils.formatCurrency(transaction.amount);

    const html = `		
			<td class="description">${transaction.description}</td>
			<td class="${CSSclass}">${amount}</td>
			<td class="date">${transaction.date}</td>
			<td>
				<img src="./assets/minus.svg">
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
  },
};

const Utils = {
  formatCurrency(value) {
    const signal = Number(value) < 0 ? '-' : '';

    value = String(value).replace(/\D/g, '');

    value = Number(value) / 100;

    value = value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    return signal + value;
  },
};

transactions.forEach((transaction) => {
  DOM.addTransaction(transaction);
});

DOM.updateBalance();

Transaction.add({
  id: 39,
  description: 'ola',
  amount: -500,
  date: '01/01/2020',
});

//1h 40
