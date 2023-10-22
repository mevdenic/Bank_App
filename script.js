"use strict";

const account1 = {
    owner: "Mike Smith",
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    owner: "Jessica Davis",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: "Steven Thomas Williams",
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: "Sarah Smith",
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");
const summary = document.querySelector(".summary");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = (movements) => {
    containerMovements.innerHTML = "";
    movements.forEach((mov, i) => {
        const type = mov > 0 ? "deposit" : "withdrawal";
        const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${type}">${
            i + 1
        } ${type}</div>
            <div class="movements__value">${mov}€</div>
        </div>`;
        containerMovements.insertAdjacentHTML("afterbegin", html);
    });
};

//computing usernames
const creatingUsernames = (accounts) => {
    accounts.forEach((acc) => {
        acc.username = acc.owner
            .toLowerCase()
            .split(" ")
            .map((str) => str[0])
            .join("");
    });
};
creatingUsernames(accounts);

//deposits and withdrawals
const depositsWithdrawalsFunc = (accounts) => {
    accounts.forEach((acc) => {
        acc.deposits = acc.movements.filter((mov) => mov > 0);
    });
    accounts.forEach((acc) => {
        acc.withdrawals = acc.movements.filter((mov) => mov < 0);
    });
};
depositsWithdrawalsFunc(accounts);

const totalDeposits = (movements) => {
    const totalDep = movements
        .filter((mov) => mov > 0)
        .reduce((acc, dep) => acc + dep, 0);
    labelSumIn.textContent = `${totalDep}€`;
};
const totalWithdrawals = (movements) => {
    const totalWit = movements
        .filter((x) => x < 0)
        .reduce((acc, wit) => acc + wit, 0);
    labelSumOut.textContent = `${Math.abs(totalWit)}€`;
};

//interest display
const interestFunc = (balance, int) => {
    const interest = balance * int * 0.01;
    labelSumInterest.textContent = `${
        Math.round((interest + Number.EPSILON) * 100) / 100
    }€`;
};

//account balance
let balance;
const accountBalanceDisplay = (movements) => {
    balance = movements.reduce((acc, mov) => acc + mov, 0);
    labelBalance.textContent = `${balance}€`;
};

//input clear
const clearInput = () => {
    inputCloseUsername.value = "";
    inputClosePin.value = "";
    inputLoanAmount.value = "";
    inputTransferTo.value = "";
    inputTransferAmount.value = "";
};

//LOGIN
let currentAccount;
btnLogin.addEventListener("click", (e) => {
    e.preventDefault();
    currentAccount = accounts.find(
        (acc) => acc.username === inputLoginUsername.value
    );
    console.log(currentAccount);
    if (currentAccount?.pin === Number(inputLoginPin.value)) {
        //?. -> optional chaining
        //display app
        containerApp.style.opacity = 100;
        //welcome message
        labelWelcome.textContent = `Welcome, ${currentAccount.owner
            .split(" ")[0]
            .toUpperCase()}!`;
        //movements
        displayMovements(currentAccount.movements);
        //balance
        accountBalanceDisplay(currentAccount.movements);
        //summary
        totalDeposits(currentAccount.movements);
        totalWithdrawals(currentAccount.movements);
        interestFunc(balance, currentAccount.interestRate);
        //login cred delete
        inputLoginUsername.value = inputLoginPin.value = "";
        inputLoginPin.blur();
        inputLoginUsername.blur();
    } else alert("Wrong credentials.");
});

//TRANSFER MONEY
let transferAccount;
btnTransfer.addEventListener("click", (e) => {
    e.preventDefault();
    transferAccount = accounts.find(
        (acc) => acc.username === inputTransferTo.value
    );
    console.log(transferAccount);
    if (inputTransferTo.value === "" || inputTransferAmount.value === "") {
        alert("Please fill out both fields.");
        clearInput();
    } else if (
        transferAccount === currentAccount ||
        transferAccount === undefined
    ) {
        alert("Invalid account.");
        clearInput();
    } else if (Number(inputTransferAmount.value) > balance) {
        alert("Not enough funds.");
        clearInput();
    } else if (Number(inputTransferAmount.value) <= 0) {
        alert("Please input ammount bigger than 0.");
        clearInput();
    } else {
        transferAccount.movements.push(Number(inputTransferAmount.value));
        currentAccount.movements.push(Number(inputTransferAmount.value) * -1);
        accountBalanceDisplay(currentAccount.movements);
        interestFunc(balance, currentAccount.interestRate);
        totalWithdrawals(currentAccount.movements);
        displayMovements(currentAccount.movements);
        clearInput();
    }
});

//REQUEST LOAN
btnLoan.addEventListener("click", (e) => {
    e.preventDefault();
    if (
        Number(inputLoanAmount.value) <= balance * 0.2 &&
        Number(inputLoanAmount.value) > 0
    ) {
        currentAccount.movements.push(Number(inputLoanAmount.value));
        console.log(currentAccount.movements);
        displayMovements(currentAccount.movements);
        accountBalanceDisplay(currentAccount.movements);
        totalDeposits(currentAccount.movements);
        interestFunc(balance, currentAccount.interestRate);
        clearInput();
    } else if (Number(inputLoanAmount.value) <= 0) {
        alert("Loan has to be bigger than 0 EURO.");
        clearInput();
    } else {
        alert("Loan ammount is bigger than 20% of your account.");
        clearInput();
    }
});

//CLOSE ACCOUNT
btnClose.addEventListener("click", (e) => {
    e.preventDefault();
    if (
        inputCloseUsername.value === currentAccount.username &&
        Number(inputClosePin.value) === currentAccount.pin
    ) {
        const index = accounts.findIndex(
            (acc) => acc.username === currentAccount.username
        );
        accounts.splice(index, 1);
        containerApp.style.opacity = 0;
        labelWelcome.textContent = `Log in to get started`;
        clearInput();
    } else {
        alert("Wrong credentials, failed to close account.");
        clearInput();
    }
});

//SORT MOVEMENTS

let bool = 1;
btnSort.addEventListener("click", () => {
    if (bool === 1) {
        displayMovements(currentAccount.movements.toSorted((a, b) => a - b));
        btnSort.innerHTML = `&downarrow; SORT`;
        bool = 2;
    } else if (bool === 2) {
        displayMovements(currentAccount.movements.toSorted((a, b) => b - a));
        btnSort.innerHTML = `&rightarrow; SORT`;
        bool = 3;
    } else if (bool === 3) {
        displayMovements(currentAccount.movements);
        btnSort.innerHTML = `&uparrow; SORT`;
        bool = 1;
    }
    btnSort.blur();
});
