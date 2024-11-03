// If page doesnt load run below line
// localStorage.clear();

document.getElementById("date").valueAsDate = new Date();

const form = document.getElementById("transactionForm");
const tableBody = document
  .getElementById("transactionTable")
  .querySelector("tbody");

const transactionManager = (() => {
  let balance = 0;
  return {
    updateBalance: (type, amount) =>
      (balance += type === "income" ? amount : -amount),
    getBalance: () => balance.toFixed(2),
  };
})();

async function fetchExchangeRate() {
  try {
    return await new Promise((resolve) =>
      setTimeout(() => resolve(0.85), 1000)
    );
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return null;
  }
}

const storage = {
  save: (transactions) =>
    localStorage.setItem("transactions", JSON.stringify(transactions)),
  load: () => JSON.parse(localStorage.getItem("transactions")) || [],
};

function addTransactionToTable({ date, type, category, amount }, save = true) {
  const row = tableBody.insertRow();
  row.innerHTML = `<td>${date}</td><td>${type}</td><td>${category}</td><td>${parseFloat(
    amount
  ).toFixed(2)}</td>`;
  if (save) {
    transactions.push({ date, type, category, amount });
    storage.save(transactions);
  }
}

const transactions = storage.load();
transactions.forEach(({ type, amount }) =>
  transactionManager.updateBalance(type, parseFloat(amount))
);
transactions.forEach(addTransactionToTable);
console.log(`Loaded Balance: ${transactionManager.getBalance()}`);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const date = document.getElementById("date").value;
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value;
  let amount = parseFloat(document.getElementById("amount").value);

  if (isNaN(amount) || amount <= 0) {
    console.log("Please enter a valid positive amount.");
    return;
  }

  const exchangeRate = await fetchExchangeRate();
  if (exchangeRate) {
    amount *= exchangeRate;
    console.log(`Converted Amount (in EUR): ${amount.toFixed(2)}`);
  } else {
    console.log(
      "Could not retrieve the exchange rate. Proceeding with the original amount."
    );
  }

  transactionManager.updateBalance(type, amount);
  console.log(`Updated Balance: ${transactionManager.getBalance()}`);

  addTransactionToTable({ date, type, category, amount: amount.toFixed(2) });

  form.reset();
  document.getElementById("date").valueAsDate = new Date();
});
