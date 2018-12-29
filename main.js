// LOCAL STORAGE
// EXPENSES:
const getExpenses = () => {
  const store = localStorage.getItem("expenses");
  return store === null ? [] : JSON.parse(store);
};

const addExpense = expense => {
  const store = getExpenses();
  localStorage.setItem("expenses", JSON.stringify([...store, expense]));
};

const deleteExpense = id => {
  const store = getExpenses().filter(e => e.id != id);
  localStorage.setItem("expenses", JSON.stringify(store));
};

// remove all expenses
const removeExpenses = () => {
  localStorage.removeItem("expenses");
};

// BUDGET
// set budget
const setBudget = budget => {
  localStorage.setItem("budget", JSON.stringify(budget));
};
// get budget
const getBudget = () => {
  const budget = localStorage.getItem("budget");
  return budget === null ? 0 : JSON.parse(budget);
};

// EXPENSE && CALCULATOR OBJECTS
// expense item
const newExpense = (name, amount) => {
  const id = Math.random();
  return {
    name,
    amount,
    id
  };
};

// budget calculator
const calculator = () => {
  const expenses = getExpenses().reduce(
    (acc, curr) => acc + parseFloat(curr.amount),
    0
  );
  const budget = getBudget();
  const balance = Math.floor((budget - expenses) * 100) / 100;

  return {
    budget,
    expenses,
    balance
  };
};

// DISPLAYS
// display expenses
const displayExpenses = () => {
  const expenses = getExpenses();
  expenses.forEach(e => addExpenseRow(e));
};

// display calculator
const displayCalculator = () => {
  const { budget, expenses, balance } = calculator();
  const balanceNode = document.querySelector("#balance-val");

  document.querySelector("#budget-val").textContent = budget;
  document.querySelector("#expenses-val").textContent = expenses;
  balanceNode.textContent = balance;

  balance < 0
    ? (balanceNode.className = "red-text text-darken-2")
    : (balanceNode.className = "green-text text-darken-2");
};

// kind of alert
const displayMessage = (section, classColor, message) => {
  const div = document.createElement("div");
  div.className = "collection center";
  div.innerHTML = `
  <a href="#!" class="collection-item ${classColor} active">${message}</a>
  `;

  const form = document.querySelector(`#${section}-form`);
  const parentDiv = form.parentNode;
  parentDiv.insertBefore(div, form);

  setTimeout(() => document.querySelector(".collection").remove(), 2000);
};

//
// add budget to calculator
const addBudgetToCalculator = num => {
  document.querySelector("#budget-val").textContent = num;
};

// add expense to table
const addExpenseRow = expense => {
  const { name, amount, id } = expense,
    table = document.querySelector("#expense-list"),
    expenseRow = document.createElement("tr");

  expenseRow.id = id;
  expenseRow.innerHTML = `
    <td>${name}</td>
    <td>${amount}</td>
    <td>
      <a class="btn-floating btn-small red">
        <i class="material-icons edit">edit</i>
      </a>
      <a class="btn-floating btn-small red">
        <i class="material-icons delete">delete</i>
      </a>
    </td>
    `;

  table.appendChild(expenseRow);
};

// Event Listeners
// on submit expense
document.querySelector("#expense-form").addEventListener("submit", e => {
  e.preventDefault();
  const name = e.target[0].value,
    amount = e.target[1].value;

  const failure = () => {
    displayMessage(
      "expense",
      "amber darken-2",
      "Please name your expense with amount value!"
    );
  };

  const success = () => {
    const expense = newExpense(name, amount);
    addExpenseRow(expense);
    addExpense(expense);
    displayCalculator();
    displayMessage("expense", "red", "Expense Added");
    (e.target[0].value = ""), (e.target[1].value = "");
  };

  name === "" || amount <= 0 ? failure() : success();
});

// on submit calculator
document.querySelector("#budget-form").addEventListener("submit", e => {
  e.preventDefault();
  const val = e.target[0].value;

  const failure = () => {
    displayMessage(
      "budget",
      "amber darken-2",
      "Please enter a positive number!"
    );
    e.target[0].value = "";
  };

  const success = () => {
    setBudget(val);
    displayCalculator();
    displayMessage("budget", "green darken-2", "Budget Added");
    e.target[0].value = "";
  };

  val > 0 ? success() : failure();
});

// revome all expenses at once
document.querySelector("#delAll").addEventListener("click", () => {
  removeExpenses();
  displayCalculator();
  let table = document.getElementById("expense-list");
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
});

// delete expense
const deleteExpenseClick = () => {
  const deleteIcons = document.getElementsByClassName("material-icons delete");

  Array.from(deleteIcons).forEach(e => {
    e.addEventListener("click", e => {
      const id = e.target.parentElement.parentElement.parentElement.id;

      deleteExpense(id);
      document.getElementById(`${id}`).remove();
      displayCalculator();
    });
  });
};

// fake update expense
const updateExpenseClick = () => {
  const editIcons = document.getElementsByClassName("material-icons edit");

  Array.from(editIcons).forEach(e => {
    e.addEventListener("click", e => {
      const id = e.target.parentElement.parentElement.parentElement.id;
      const expense = getExpenses().find(e => e.id == id);
      const { name, amount } = expense;

      document.querySelector("#expense-name").value = name;
      document.querySelector("#expense-amount").value = amount;

      // just deleting expense
      deleteExpense(id);
      document.getElementById(`${id}`).remove();
      displayCalculator();
    });
  });
};

// ready or not here i come
const ready = () => {
  displayCalculator();
  displayExpenses();
  updateExpenseClick();
  deleteExpenseClick();
};
document.addEventListener("DOMContentLoaded", ready());
