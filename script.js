'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}</div>
  </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  acc.balance = balance;
  labelBalance.textContent = `${balance} $`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${incomes} $`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}  $`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest} $`;
};

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUserNames(accounts);
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc.movements);

  //Display balance
  calcDisplayBalance(acc);

  //Display Summary
  calcDisplaySummary(acc);
};

//EVENT LISTENERS

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    updateUI(currentAccount);

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //UPDATE UI
    updateUI(currentAccount);
  }
});

//LOAN FEATURE

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //ADD movement
    currentAccount.movements.push(amount);

    //UPDATE UI
    updateUI(currentAccount);
  } else {
    alert('Please enter valid loan account');
  }

  //CLEARING INPUT FILEDS
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('delete');
  const deleteAccountName = inputCloseUsername.value;
  const deleteAccountPin = Number(inputClosePin.value);

  if (
    currentAccount.userName === deleteAccountName &&
    currentAccount.pin === deleteAccountPin
  ) {
    const accountToBeDeleted = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );

    //DELETE account
    accounts.splice(accountToBeDeleted, 1);

    //HIDE UI
    containerApp.style.opacity = 0;
  }

  //CLEARING THE INPUT FIELDS
  inputClosePin.value = inputCloseUsername.value = '';
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////

// for (const movement of movements)
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`You Deposited ${movement}`);
//   } else {
//     console.log(`You with drew ${Math.abs(movement)}`);
//   }
// }

// console.log('---------FOREACH---------');
// movements.forEach(function (movement, i, array) {
//   if (movement > 0) {
//     console.log(`You Deposited ${movement}`);
//   } else {
//     console.log(`You with drew ${Math.abs(movement)}`);
//   }
// });

// const checkDogs = function (arg = []) {
//   console.log(arg);
// let shallowCopy = [...juliaData];
// shallowCopy.splice(0, 1);
// shallowCopy.splice(-2);
// console.log(shallowCopy);
// const newData = [...shallowCopy, ...KateData];

// newData.forEach((age, i) => {
//   if (age >= 3) {
//     console.log(`Dog ${i+1} is an Adult ans is ${age} years old`);
//   } else {
//     console.log(`Dog ${i+1} is still puppy and is ${age} years old`);
//   }
// });
// };

// const juliaData = [3, 5, 2, 12, 7];
// const KateData = [9, 16, 6, 8, 3];
// checkDogs(juliaData, KateData, [1, 2, 3, 4]);

// MAP METHOD
// const euroToUsd = 1.1;

// const movementsUSD = movements.map(mov => {
//   return mov * euroToUsd;
// });

// console.log(movementsUSD);
// const movementsDescription = movements.map((mov, i, arr) => {
//   if (mov > 0) {
//     return `You Deposited ${mov}`;
//   } else {
//     return `You with drew ${Math.abs(movement)}`;
//   }
// });

// FILTER METHOD
// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });

// const withdrawals = movements.filter(mov => mov < 0);
// console.log(withdrawals);

// REDUCE METHOD

//accumulator is like a snowball

// const balance = movements.reduce(function (acc, curr, i, arr) {
//   return acc + curr;
// }, 0);

//MAXIMUM VALUE

// const max = movements.reduce((acc, curr) => (acc < curr ? curr : acc), 0);
// console.log(max);

//PIPELINE
// const euroToUsd = 1.1;
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUsd)
//   .reduce(acc, mov => acc + mov, 0);

// console.log(totalDepositsUSD);

//FLAT AND FLAT MAP

// const accountMovements = accounts.map(acc => acc.movements);
// const allMovements = accountMovements.flat();
// const overAllBalance = allMovements.reduce(acc, mov => acc + mov, 0);

//OR

const overAllBalance = account
  .map(acc => acc.movements)
  .flat()
  .reduce(acc, mov => acc + mov, 0);

//FLAT MAP

const overAllBalance = account
  .flatmap(acc => acc.movements)
  .reduce(acc, mov => acc + mov, 0);
