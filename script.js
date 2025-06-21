'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  type: 'Premium',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  type: 'Premium',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  type: 'Premium',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  type: 'Standard',
};

const account5 = {
  owner: 'Taraha New',
  movements: [],
  interestRate: 0.7,
  pin: 5555,
  type: 'Basic',
};

const account6 = {
  owner: 'Sarah Turnwee',
  movements: [430, 1000, 1000],
  interestRate: 1.5,
  pin: 6666,
  type: 'Standard',
};

const account7 = {
  owner: 'Tea Turnwee',
  movements: [430],
  interestRate: 1.2,
  pin: 7777,
  type: 'Basic',
};
const accounts = [
  account1,
  account2,
  account3,
  account4,
  account5,
  account6,
  account7,
];
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

//---------------------
//showing movements in the account
//---------------------
const displayMovements = function (movements, sortItem = false) {
  containerMovements.innerHTML = ''; //.textContent = ''
  const sortMovements = sortItem
    ? movements.slice().sort((a, b) => a - b)
    : movements;
  sortMovements.forEach(function (move, i) {
    const type = move > 0 ? 'deposit' : 'withdrawal';
    const newHTML = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${move}€</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', newHTML);
  }); //here movements is the array
};

// console.log(containerMovements.innerHTML);
// console.log(containerMovements.textContent);

//---------------------
//Calculating Balance
//---------------------

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

//---------------------
//Calculating Summary
//---------------------

const calcDisplaySummary = function (acc) {
  const deposits = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${deposits}€`;

  const withdrawals = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(withdrawals)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      //bank introduces a condition that only the interest that is above 1 will be added
      return int > 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}€`;
};

//---------------------
//Update Ui
//---------------------
const updateUI = function (acc) {
  //Display Movements
  displayMovements(acc.movements);

  //Display Balance
  calcDisplayBalance(acc);

  //Display Summary
  calcDisplaySummary(acc);
};

//---------------------
//creating username
//---------------------

const createUserName = function (accs) {
  accs.forEach(function (acc) {
    //creating a new key in every account object
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ') //converting the name into array
      .map(word => word[0]) //taking the first two letter
      .join('');
  });
};
createUserName(accounts);
// console.log(accounts);

//---------------------
//Implementing Login
//Event handler
//---------------------

let currentAccount;

btnLogin.addEventListener('click', function (event) {
  // Prevent form from submitting
  event.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  // console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display Ui and Welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;
    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Display Movements
    // displayMovements(currentAccount.movements);

    //Display Balance
    // calcDisplayBalance(currentAccount);

    //Display Summary
    // calcDisplaySummary(currentAccount);

    //Update Ui
    updateUI(currentAccount);
  }
});

//---------------------
//Implementing Transfer
//---------------------

btnTransfer.addEventListener('click', function (event) {
  // Prevent form from submitting
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  // console.log(amount, receiverAcc);
  if (
    amount > 0 &&
    receiverAcc && // যাকে টাকা পাঠাচ্ছো, তার অ্যাকাউন্ট আছে কিনা সেটা চেক করে। যদি undefined হয় (মানে userName ভুল টাইপ করেছো), তাহলে transfer হবে না।
    currentAccount.balance >= amount &&
    receiverAcc?.userName !== currentAccount.userName //তুমি নিজের কাছেই টাকা পাঠাচ্ছো কিনা সেটা চেক করে। Same account-এ টাকা পাঠানো যাবে না। (?. use করা হইছে যেন receiverAcc না থাকলে error না দেয়)
  ) {
    //Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Update Ui
    updateUI(currentAccount);
  }
});

//---------------------
//Requesting Loan
//Bank Condition = Loan will be granted if Atleast One deposit is atleast 10% of the requested loan amount
//---------------------

btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    currentAccount.movements.some(mov => mov >= loanAmount * 0.1)
  ) {
    //Add Loan amount to the movements
    currentAccount.movements.push(loanAmount);

    //update ui
    updateUI(currentAccount);
  }
});

//---------------------
//Closing Account
//---------------------

btnClose.addEventListener('click', function (event) {
  event.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    //Close Account
    accounts.splice(index, 1);
    //Hide UI
    containerApp.style.opacity = 0;
    alert('Are you sure you want to close your account?');
  }
  alert('Your account has been deactivated. Thank you for banking with us');
  labelWelcome.textContent = 'Log in to get started';
  inputCloseUsername.value = inputClosePin.value = '';
});

//---------------------
//sorting functionality
//---------------------
let sortedState = false;

//sort button
btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  // প্রথমেই sorted এর উল্টো মান পাঠাও, তাহলে toggle হবে ঠিকভাবে
  displayMovements(currentAccount.movements, !sortedState);
  // তারপর sorted এর মান flip করে দাও
  sortedState = !sortedState;
});

/////////////////////////////////////////////////
// Simple Array Methods

// let arr = ['a', 'b', 'c', 'd', 'e'];

//SLICE doesnot change the org array
//-----------------------------------
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(1, -1));
// console.log(arr.slice()); //Shallow copy
// console.log([...arr]); //Shallow copy
// console.log([...arr].slice(2));

//SPLICE does change the org array
//-----------------------------------
//console.log(arr.splice(2)); //extracted elements are gone
// console.log(arr.splice(1, 2));
// console.log(arr); //mutated array
//console.log(arr.splice(-1)); //new arr is [a,b]

//REVERSE does change the org array
//-----------------------------------

// let arr = ['a', 'b', 'c', 'd', 'e'];
// let arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

//CONCAT doesnot change the org array
//-----------------------------------
// const letters = arr.concat(arr2);
// console.log(letters);
// const letters2 = arr2.concat(arr);
// console.log(letters2);
// console.log([...arr, ...arr2]);

//JOIN doesnot change the org array
//-----------------------------------
// console.log(letters.join('-'));
// console.log(letters);

//========================================
// THE NEW AT() METHOD doesnot change the org array

// let arr = [2, 45, 15, 75, 95];
// console.log(arr[0]);
// console.log(arr.at(0));

// console.log(arr[arr.length - 1]); //last one
// console.log(arr.at(-1)); //just like line 53
// console.log(arr);
// // console.log(arr.slice(-1)); //comes with array
// // console.log(arr.slice(-1)[0]); //now no array
// let str = 'Neil Juneja'; //works with string too
// console.log(str.at(0));

//========================================
// THE forEach() METHOD loop over an array

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
//for of
// for (const movement of movements) {
//   if (movement > 0) {
//     console.log(`You deposited ${movement}`);
//   } else {
//     console.log(`You withdrew ${Math.abs(movement)}`);
//   }
// }
//for each
// movements.forEach(function (movement) {
//   if (movement > 0) {
//     console.log(`You deposited ${movement}`);
//   } else {
//     console.log(`You withdrew ${Math.abs(movement)}`);
//   }
// }); //BTS: 0: function(200) ---> 1: function(450) ---> ....

//accessing current index
//for of
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1} : You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1} : You withdrew ${Math.abs(movement)}`);
//   }
// }

//forEach
// movements.forEach(function (currentMovement, currentIndex, entireArray) {
//   if (currentMovement > 0) {
//     console.log(
//       `Movement ${currentIndex + 1} : You deposited ${currentMovement}`
//     );
//   } else {
//     console.log(
//       `Movement ${currentIndex + 1} : You withdrew ${Math.abs(currentMovement)}`
//     );
//   }
//   console.log(entireArray);
// });

//========================================
// THE forEach() METHOD with maps and sets

//Map
// const currencies = new Map([
//   ['USD', 'United States Dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound Sterling'],
// ]);
// console.log(currencies);
// currencies.forEach(function (value, key, entireMap) {
//   console.log(`${key}: ${value}`);
//   console.log(entireMap);
// });

//Set
// const currenciesUnique = new Set([
//   'USD',
//   'United States Dollar',
//   'EUR',
//   'Euro',
//   'GBP',
//   'Pound Sterling',
//   'USD',
//   'EUR',
//   'Pound Sterling',
// ]);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, key, fullSet) {
//   console.log(`${key}: ${value}`);
//   //console.log(fullSet);
// });

// const currenciesUnique = new Set([
//   'USD',
//   'United States Dollar',
//   'EUR',
//   'Euro',
//   'GBP',
//   'Pound Sterling',
//   'USD',
//   'EUR',
//   'Pound Sterling',
// ]);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, _, fullSet) {
//   //_ underscore is a throwaway variable means its unnecessary
//   console.log(`${value}: ${value}`);
//   //console.log(fullSet);
// });

//========================================
///////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const dogsJulia = [3, 5, 2, 12, 7];
// const dogsKate = [4, 1, 15, 8, 3];
// const checkDogs = function (dogsJulia, dogsKate) {
//   // 1. Julia's shallow copy, and remove first and last two elements

//   const dogsJuliaCorrected = dogsJulia.slice();
//   const allDogs = dogsJuliaCorrected.slice(1, -2); //btr to use splice

//   // 2. Combine Julia's corrected data with Kate's

//   allDogs.concat(dogsKate).forEach(function (age, i) {
//     // 3. Log whether each dog is an adult or a puppy

//     const checkAge =
//       age >= 3
//         ? `Dog number ${i + 1} is an adult, and is ${age} years old`
//         : `Dog number ${i + 1} is still a puppy 🐶`;
//     console.log(checkAge);
//   });
// };
// checkDogs(dogsJulia, dogsKate);
// console.log(`-------------TEST DATA 2------------`);
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

//or better version

// const checkDogs = function (dogsJulia, dogsKate) {
//   const dogsJuliaCorrected = dogsJulia.slice();
//   dogsJuliaCorrected.splice(0, 1);
//   dogsJuliaCorrected.splice(-2);
//   //dogsJulia.slice(1,3)
//   console.log(dogsJuliaCorrected);
//   const dogs = dogsJuliaCorrected.concat(dogsKate);
//   //[...dogsJuliaCorrected, ...dogsKate];
//   dogs.forEach(function (dog, i) {
//     if (dog >= 3) {
//       console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`);
//     } else {
//       console.log(`Dog number ${i + 1} is still a puppy 🐶`);
//     }
//   });
// };
// // checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

//========================================
// The map Method() more inline with functional programming
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const euroToUsd = 1.1;
// const movementsUsd = movements.map(function (move) {
//   return move * euroToUsd;
// });
// console.log(movementsUsd);
// console.log(movements);

//refactoring using arrow
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const euroToUsd = 1.1;
// const movementsUsd = movements.map(move => move * euroToUsd);
// console.log(movementsUsd);
// console.log(movements);

// const movementsDescription = movements.map(
//   (move, i, arr) =>
//     `Movement ${i + 1} : You ${move > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       move
//     )}`
// );
// console.log(movementsDescription);

//same using for of loop differnt philosophy or paradigms
// const movementsUsd = [];
// for (const move of movements) {
//   movementsUsd.push(move * euroToUsd);
// }
// console.log(movementsUsd);
// console.log(movements);

//========================================
// The filter Method()
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const deposits = movements.filter(mov => mov > 0);
// console.log(deposits);
// //same using for loop
// const depositedFor = [];
// for (const mov of movements) if (mov > 0) depositedFor.push(mov);
// console.log(depositedFor);

// const withdrawals = movements.filter(mov => mov < 0);
// console.log(withdrawals);

//========================================
// The Reduce Method()
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const balance = movements.reduce(function (acc, curr, i, arr) {
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + curr;
// }, 0); //0 is the initial value of acc(accumulator)
// console.log(balance);

//or using arrow
// const balance = movements.reduce((acc, curr) => acc + curr, 100);
// console.log(balance);

//using for loop
// let sum = 0;
// for (const mov of movements) {
//   sum += mov;
// }
// console.log(sum);

//total balancewith deposit and interest
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const totalBalance = function (arr) {
//   const deposits = arr.filter(move => move > 0);
//   const totalInterest = deposits
//     .map(dep => dep * 0.02)
//     .reduce((acc, int) => acc + int, 0);
//   const totalDeposits = deposits.reduce((acc, dep) => acc + dep, 0);
//   return totalDeposits + totalInterest;
// };
// console.log(totalBalance(movements));

//Maximum value
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const maximumValue = movements.reduce((acc, cur) => {
//   console.log(`Comparing: acc=${acc}, cur=${cur}`);
//   return acc > cur ? acc : cur;
// }, movements[0]);
// console.log(`Maximum Value: ${maximumValue}`);
// console.log(Math.max(...movements));

//========================================
///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const calcAverageHumanAge = ages =>
//   ages
//     .map(age => (age <= 2 ? 2 * age : 16 + 4 * age))
//     .filter(hAge => hAge >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

//or

// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages
//     .map(age => (age <= 2 ? 2 * age : 16 + 4 * age))
//     .filter(hAge => hAge >= 18);
//   const average =
//     humanAges.reduce((acc, age) => acc + age, 0) / humanAges.length;
//   return average;
// };
// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

//========================================
// The Magic of Chaining Methods

//useful when debugging
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const euroToUsd = 1.1;
// const totalDepositsInUSD = movements
//   .filter(mov => mov > 0)
//   .map((mov, _, arr) => {
//     console.log(arr); //to see in which arr is map is being called
//     return mov * euroToUsd;
//   })
//   .reduce((acc, mov, _, arr) => {
//     console.log(arr);
//     return acc + mov;
//   }, 0);
// console.log(totalDepositsInUSD);

//========================================
///////////////////////////////////////
// Coding Challenge #3

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
// const calcAverageHumanAge = ages =>
//   ages
//     .map(age => (age <= 2 ? 2 * age : 16 + 4 * age))
//     .filter(hAge => hAge >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

//========================================
// The find() Method
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const findWithdrawal = movements.find(mov => mov < 0);
// console.log(findWithdrawal);

// console.log(accounts);
// const account = accounts.find(acc => acc.owner === 'Sarah Smith');
// const account = accounts.find(acc => acc.pin === 3333);
// acc.owner === 'Sarah Smiths' এই শর্ত প্রথম যেই object মিলে গেছে, সেই পুরো object return করে।
// console.log(account);

// //or using for of loop
// for (const acc of accounts) {
//   if (acc.owner === 'Sarah Smith') {
//     console.log(acc);
//     break; //break is necessary otherwise it'll show all the data named sarah. but find only gives the first element that matches
//   }
// }

// const acc = {
//   owner: 'Jessica Davis',
//   balance: 5000,
// };

// console.log(acc.toString());
// console.log(`${acc}`);
// console.log(acc);
// console.log(`my ${acc}`);

// const acc = {
//   owner: 'Jessica Davis',
//   balance: 5000,

//   // 🔧 এক্ষানে override করতেছি toString
//   toString() {
//     return `${this.owner} has $${this.balance}`;
//   },
// };

// console.log(`${acc}`);
// console.log(`Details: ${acc}`);
// console.log(acc);

//========================================
//  The New findLast and findLastIndex Methods
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const lastWithdrawal = movements.findLast(mov => mov < 0);
// console.log(lastWithdrawal);
// const lastWithdrawalIndex = movements.findLastIndex(mov => mov < 0);
// console.log(lastWithdrawalIndex);
// const latestLargeMovementIndex = movements.findLastIndex(
//   mov => Math.abs(mov) > 1000
// );
// console.log(latestLargeMovementIndex);
// console.log(
//   `Your latest large movements was ${
//     movements.length - latestLargeMovementIndex
//   } moments ago`
// );

//========================================
//  The Some and Every Methods
//Some Method
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//equality
// console.log(movements.includes(-130));
// console.log(movements.includes(-13));
// //condition
// const anyDeposit = movements.some(mov => mov > 5000);
// const anyWithdrawal = movements.some(mov => mov < 100);
// console.log(anyDeposit, anyWithdrawal);

//Every Method
// const checkAll = movements.every(mov => mov > 0); //check if all of elements are positive/deposit
// console.log(checkAll);
// const checkAll2 = account4.movements.every(mov => mov > 0);
// console.log(checkAll2);

//Separate callback
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

//========================================
//  The flat and flatMap Methods
//flat Method
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// //in one array using flat
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// //in one array using spread
// const newArr = [...arr[0], ...arr[1], arr[2], arr[3]];
// console.log(newArr);
// const flatDeep = [].concat(...arr);
// console.log(flatDeep);

// //in one array using reduce
// const flatArr = arr.reduce((acc, item) => acc.concat(item), []);
// console.log(flatArr);

// //in one array using flat
// const deep = [[[1, 2]], [[[3, 4]]], 5];
// console.log(deep.flat(3)); //how many nested array = 3

//calculating all the movements of all the accounts
// const allMovements = [
//   account1.movements,
//   account2.movements,
//   account3.movements,
//   account4.movements,
// ];
// console.log(allMovements.flat());
// const accMovements = accounts.map(acc => acc.movements).flat();
// console.log('Flat:', accMovements);
// const overallBalance = accMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);

// //flatmap
// const overallBalanceFlatMap = accounts.flatMap(acc => acc.movements);
// console.log('FlatMap:', overallBalanceFlatMap);
// const overallBalance2 = overallBalanceFlatMap.reduce(
//   (acc, mov) => acc + mov,
//   0
// );
// console.log(overallBalance2);

///////////////////////////////////////
// Coding Challenge #4

/*
This time, Julia and Kate are studying the activity levels of different dog breeds.

YOUR TASKS:
1. Store the the average weight of a "Husky" in a variable "huskyWeight"
2. Find the name of the only breed that likes both "running" and "fetch" ("dogBothActivities" variable)
3. Create an array "allActivities" of all the activities of all the dog breeds
4. Create an array "uniqueActivities" that contains only the unique activities (no activity repetitions). HINT: Use a technique with a special data structure that we studied a few sections ago.
5. Many dog breeds like to swim. What other activities do these dogs like? Store all the OTHER activities these breeds like to do, in a unique array called "swimmingAdjacent".
6. Do all the breeds have an average weight of 10kg or more? Log to the console whether "true" or "false".
7. Are there any breeds that are "active"? "Active" means that the dog has 3 or more activities. Log to the console whether "true" or "false".

BONUS: What's the average weight of the heaviest breed that likes to fetch? HINT: Use the "Math.max" method along with the ... operator.

TEST DATA:
*/
/*
const breeds = [
  {
    breed: 'German Shepherd',
    averageWeight: 32,
    activities: ['fetch', 'swimming'],
  },
  {
    breed: 'Dalmatian',
    averageWeight: 24,
    activities: ['running', 'fetch', 'agility'],
  },
  {
    breed: 'Labrador',
    averageWeight: 28,
    activities: ['swimming', 'fetch'],
  },
  {
    breed: 'Beagle',
    averageWeight: 12,
    activities: ['digging', 'fetch'],
  },
  {
    breed: 'Husky',
    averageWeight: 26,
    activities: ['running', 'agility', 'swimming'],
  },
  {
    breed: 'Bulldog',
    averageWeight: 36,
    activities: ['sleeping'],
  },
  {
    breed: 'Poodle',
    averageWeight: 18,
    activities: ['agility', 'fetch'],
  },
];

//1.
const huskyWeight = breeds.find(breed => breed.breed === 'Husky').averageWeight;
console.log(huskyWeight);

//2.
const dogBothActivities = breeds.find(
  breed =>
    breed.activities.includes('running') && breed.activities.includes('fetch')
).breed;
console.log(dogBothActivities);

//3.
const allActivities = breeds.flatMap(breed => breed.activities);
console.log(allActivities);

//4.
const uniqueActivities = [...new Set(allActivities)];
console.log(uniqueActivities);

//5.
const swimmingAdjacent = [
  ...new Set(
    breeds
      .filter(breed => breed.activities.includes('swimming'))
      .flatMap(breed => breed.activities)
      .filter(act => act !== 'swimming')
  ),
];
console.log(swimmingAdjacent);

//6.
const allAverageWeight = breeds.every(breed => breed.averageWeight >= 10);
console.log(allAverageWeight);

//7.
const activeBreed = breeds.some(breed => breed.activities.length >= 3);
console.log(activeBreed);

//Bonus
const heaviestAverageOfFetchBreed = breeds
  .filter(breed => breed.activities.includes('fetch'))
  .map(breed => breed.averageWeight);
console.log(heaviestAverageOfFetchBreed);
console.log(Math.max(...heaviestAverageOfFetchBreed));
*/

//========================================
//  Sorting Arrays

//strings
// const owners = ['Jonas', 'Zach', 'Neil', 'Adam', 'Malcom'];
// console.log(owners.sort()); //mutates org array
// console.log(owners);

//numbers
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements.sort()); //doesnot work
// console.log(movements);

// const sortedMovementsAscending = movements.sort((a, b) => {
//   if (a > b) return 1; //a should come after b
//   else if (a < b) return -1; //a should come before b
//   else return 0;
// });
// console.log('Ascending : ', sortedMovementsAscending);

//or
// const sortedMovementsAscending2 = movements.sort((a, b) => a - b);
// console.log('Ascending 2 : ', sortedMovementsAscending2);

// const sortedMovementsDescending = movements.sort((a, b) => {
//   if (a > b) return -1;
//   else if (a < b) return 1;
//   else return 0;
// });
// console.log('Descending : ', sortedMovementsDescending);

//or
// const sortedMovementsDescending2 = movements.sort((a, b) => b - a);
// console.log('Descending 2 : ', sortedMovementsDescending2);

//========================================
// Array Grouping

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const groupedMovements = Object.groupBy(movements, movement =>
//   movement > 0 ? 'deposit' : 'withdraw'
// );
// console.log(groupedMovements);

// const groupedAcc = Object.groupBy(accounts, account => {
//   const movementLength = account.movements.length;
//   if (movementLength >= 8) return 'Very Active';
//   if (movementLength >= 5) return 'Active';
//   if (movementLength >= 3) return 'Moderate';
//   if (movementLength >= 1) return 'Very Low';
//   return 'Inactive';
// });
// console.log(groupedAcc);
//grouping objects
// const groupedByType = Object.groupBy(accounts, account => account.type);
// console.log(groupedByType);

// const groupedByInterest = Object.groupBy(
//   accounts,
//   account => account.interestRate
// );
// console.log(groupedByInterest);

//with destructure
// const groupedByInterest = Object.groupBy(
//   accounts,
//   ({ interestRate }) => interestRate
// );
// console.log(groupedByInterest);

// const groupedByPIN = Object.groupBy(accounts, ({ pin }) => pin);
// console.log(groupedByPIN);

//========================================
// More Ways of Creating and Filling Arrays

//empty array with fill method
// const arr = new Array(7);
// console.log(arr);
// const newArr = new Array(6).fill(2);
// console.log(newArr);
// const newArr2 = [6];
// console.log(newArr2.fill(3)); //mutates org array
// const newArr3 = new Array(7).fill(2, 1, 6);
// console.log(newArr3);
// const newArr4 = [1, 2, 3, 4, 5, 6];
// newArr4.fill(13, 2, 4);
// console.log(newArr4);

//Array.from
// const arr = Array.from({ length: 5 }, () => 3);
// console.log(arr);
// const arr2 = Array.from(
//   { length: 5 },
//   (currentElement, currentIndex) => currentIndex + 1
// );
// console.log(arr2);
//or
// const arr2 = Array.from({ length: 5 }, (_, currentIndex) => currentIndex + 1);
// console.log(arr2);
//creating an array with 100 random dice rolls
// const diceRolls = Array.from(
//   { length: 100 },
//   (_, i) => Math.floor(Math.random() * 6) + 1
// );
// console.log(diceRolls);
//which value comes how many times
// const count = {};
// diceRolls.forEach(num => {
//   count[num] = (count[num] || 0) + 1;
// });
// console.log(count);

//real use case of Array.from()
//suppose bankist app er movements array ta dea ni akhn ui theke je value gula dkhasse agular sum ber krte hbe. tar mane somehow ederke akta array te convert korte hbe then calculate krte hbe. lets say amra balance er upor click krle console e dekhabe sum ta. eventhandler e kaj ta krsi cz ui er info gula update hoe astese html theke na. jdi event handler na ditam dn html er 2ta e sudhu asto.html/js er jekhane movements gula add krso jdi spacing thik na thake tahole ultapalta aste pare
// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value')
//   ).map(mov => Number(mov.textContent.replace('€', '')));
//   console.log(movementsUI);
// });
//or using as 2nd parameter of array.from
// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     mov => Number(mov.textContent.replace('€', ''))
//   );

//   console.log(movementsUI);

//   //or using spread we can convert into array but in this case mapping function will be separate
//   const movementsUI2 = [...document.querySelectorAll('.movements__value')].map(
//     mov => Number(mov.textContent.replace('€', ''))
//   );
//   console.log(movementsUI2);
// });
// labelBalance.addEventListener('click', function () {
//   const movementsUi = Array.from(
//     document.querySelectorAll('.movements__value'),
//     element => Number(element.textContent.replace('€', ''))
//   );
//   console.log(movementsUi);
//   //or
//   const movementsUI2 = Array.from(
//     document.querySelectorAll('.movements__value')
//   );
//   console.log(
//     movementsUI2.map(ele => Number(ele.textContent.replace('€', '')))
//   );
//   //or
//   const movementsUi3 = [...document.querySelectorAll('.movements__value')].map(
//     el => Number(el.textContent.replace('€', ''))
//   );
//   console.log(movementsUi3);
// });

//========================================
//Non-Destructive Alternatives: toReversed, toSorted, toSpliced, with

//reversed mutates the array
console.log(movements);
// const reservedMove = movements.reverse();
// console.log(reservedMove);
// console.log(movements);

// const reservedMove2 = movements.slice().reverse();
// console.log(reservedMove2);
// console.log(movements);

//to reversed doesnot mutate the array

// const reversedMovements = movements.toReversed();
// console.log(reversedMovements);
// console.log(movements);

//sort mutates the array
// const sorted = movements.sort((a, b) => a - b);
// console.log(sorted);
// console.log(movements);

//to sorted doesnot mutate the array
// const sorted = movements.toSorted((a, b) => a - b);
// console.log(sorted);
// console.log(movements);

//toSpliced-splice
// const spliced = movements.splice(1, 3); //index 1 theke 3 porjnto kato
// console.log(spliced);//jeta kate seta return kore
// console.log(movements);

// const toSpliced = movements.toSpliced(1, 3); //index 1 theke 3 porjnto kato
// console.log(toSpliced); //katar porer array r baki part return kore
// console.log(movements);

//change element in array
// movements[2] = 2000;
// console.log(movements); //mutates the array

//if we dont want to mutate
// const newMove = movements.with(2, 2000);
// console.log(newMove);
// console.log(movements);

//========================================
// Array Methods Practice

// const bankDepositSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce((accu, mov) => accu + mov, 0);
// console.log(bankDepositSum);

//using reduce
// const bankDepositSum = accounts
//   .flatMap(acc => acc.movements)
//   // .reduce((accu, mov) => (mov > 0 ? accu + mov : accu), 0);
//   //or
//   .reduce((accu, mov) => {
//     if (mov > 0) {
//       return accu + mov;
//     } //reduce ফাংশন প্রত্যেক iteration-এ অবশ্যই কিছু return করতে চায়, কারণ সেই রিটার্ন করা ভ্যালুটাই নতুন accumulator হবে
//     else {
//       return accu;
//     }
//   }, 0);
// console.log(bankDepositSum);

//----------------------------------

// const numDeposit = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;
// console.log(numDeposit);

//or
//using reduce
// const numDeposit = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((accu, current) => {
//     if (current >= 1000) accu.push(current);
//     return accu;
//   }, []).length; // ekhane accu = [], initially empty array tai hsse accu
// console.log(numDeposit);

//----------------------------------

// const numDeposit = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((count, current) => (current >= 1000 ? count + 1 : count), 0);
// .reduce((count, current) => (current >= 1000 ? count ++ : count), 0); //doesnt work
// .reduce((count, current) => (current >= 1000 ? ++count : count), 0); //works. ++ ke prefix hisebe dite hbe
//console.log(numDeposit);

// let a = 10;
// console.log(a++); //প্রথমে a'র current মান return করে (console.log দেখায়): a = 10, তাই console.log(a++) → print করবে 10 তারপর a এর মান বাড়ায়: a = 10 থেকে increment হয়ে হয় a = 11
// console.log(a + 1);
// console.log(++a);
// console.log(a);

//----------------------------------

// const sums = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, current) => {
//       current > 0 ? (sums.deposits += current) : (sums.withdrawals += current);
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(sums);

//with destructuring
// const { deposits, withdrawals } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, current) => {
//       current > 0 ? (sums.deposits += current) : (sums.withdrawals += current);
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(deposits, withdrawals);

//or
// const { deposits, withdrawals } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, current) => {
//       sums[current > 0 ? 'deposits' : 'withdrawals'] += current;
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(deposits, withdrawals);

// const sumsBoth = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, current) => {
//       current > 0 ? (sums.deposits += current) : (sums.withdrawals += current);
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(sumsBoth);

//or
//reduce using desturcture
// const { deposit, withdrawals } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, current) => {
//       current > 0 ? (sums.deposit += current) : (sums.withdrawals += current);
//       return sums;
//     },
//     { deposit: 0, withdrawals: 0 }
//   );
// console.log(deposit, withdrawals);

//or reduce
// const sumsBoth = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sum, current) => {
//       sum[current > 0 ? 'deposit' : 'withdrawals'] += current; //sum[with ternary this creates key like sum[deposit] or sum.deposit]
//       return sum;
//     },
//     { deposit: 0, withdrawals: 0 }
//   );
// console.log(sumsBoth);

// const convertTitleCase = function (title) {
//   const capitalize = str => str[0].toUpperCase() + str.slice(1);
//   const exceptions = [
//     'a',
//     'an',
//     'and',
//     'the',
//     'but',
//     'or',
//     'on',
//     'in',
//     'with',
//     'of',
//   ];
//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(word => (exceptions.includes(word) ? word : capitalize(word)))
//     .join(' ');

//   return capitalize(titleCase);
// };
// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a LONG title but not too long'));
// console.log(convertTitleCase('and here is another EXAMple of a nice title'));
// console.log(convertTitleCase('this is a nice title'));

//=================================================
// title converter
//=================================================

// const capitalizeConverter = function (str) {
//   const capitalizeFirst = str => str[0].toUpperCase() + str.slice(1);
//   const exceptions = ['and', 'or', 'but', 'of', 'in', 'a', 'the', 'an'];
//   const titleCase = str
//     .toLowerCase()
//     .split(' ')
//     .map(word => (exceptions.includes(word) ? word : capitalizeFirst(word)))
//     .join(' ');

//   return capitalizeFirst(titleCase);
// };

//or using reduce
// const capitalizeConverter = function (str) {
//   const exceptions = ['and', 'or', 'but', 'of', 'in', 'a', 'the', 'an'];
//   const titleCase = str
//     .toLowerCase()
//     .split(' ')
//     .reduce((accu, curr, i) => {
//       const word =
//         i === 0 || !exceptions.includes(curr)
//           ? curr[0].toUpperCase() + curr.slice(1)
//           : curr;
//       return accu + ' ' + word;
//     }, '');
//   return titleCase;
// };

// console.log(capitalizeConverter('this is a nice title'));
// console.log(capitalizeConverter('this is a LONG title but not too long'));
// console.log(capitalizeConverter('and here is another EXAMple of a nice title'));
// console.log(capitalizeConverter('this is a nice title'));

///////////////////////////////////////
// Coding Challenge #5

/* 
Julia and Kate are still studying dogs. This time they are want to figure out if the dogs in their are eating too much or too little food.

- Formula for calculating recommended food portion: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
- Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
- Eating an okay amount means the dog's current food portion is within a range 10% above and below the recommended portion (see hint).

YOUR TASKS:
1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion (recFood) and add it to the object as a new property. Do NOT create a new array, simply loop over the array (We never did this before, so think about how you can do this without creating a new array).
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple users, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much (ownersTooMuch) and an array with all owners of dogs who eat too little (ownersTooLittle).
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is ANY dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether ALL of the dogs are eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Group the dogs into the following 3 groups: 'exact', 'too-much' and 'too-little', based on whether they are eating too much, too little or the exact amount of food, based on the recommended food portion.
9. Group the dogs by the number of owners they have
10. Sort the dogs array by recommended food portion in an ascending order. Make sure to NOT mutate the original array!

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
*/
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John', 'Leo'] },
  { weight: 18, curFood: 244, owners: ['Joe'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];
//1. with creating array using map
// const recommendedFood = function (arr) {
//   const portion = arr.map(dog => {
//     dog.recFood = Math.trunc(dog.weight ** 0.75 * 28);
//     return dog.recFood;
//   });
//   return portion;
// };
// recommendedFood(dogs);
// console.log(dogs);

//or using forEach loop
// dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
dogs.forEach(dog => (dog.recFood = Math.floor(dog.weight ** 0.75 * 28)));
console.log(dogs);

//2.
// const dogSarah = dogs.find(dog => {
//   if (dog.owners.includes('Sarah')) {
//     dog.curFood > dog.recFood
//       ? console.log(`Sarah's dog ${dog.curFood} eats too much`)
//       : console.log(`Sarah's dog eats too little`);
//   }
// });

//or
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(
  `Sarah's dog eats too ${
    dogSarah.curFood > dogSarah.recFood ? 'much' : 'little'
  }`
);

//3.
// const ownersTooMuch = [];
// const ownersTooLittle = [];
// const ownersArray = function (dogs) {
//   dogs.forEach(dog => {
//     dog.curFood > dog.recFood
//       ? ownersTooMuch.push(...dog.owners)
//       : ownersTooLittle.push(...dog.owners);
//   });
// };
// ownersArray(dogs);
// console.log(ownersTooMuch);
// console.log(ownersTooLittle);

//or

const ownersTooMuch = dogs
  .filter(dog => dog.curFood > dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownersTooMuch);

//4.
const formatOwners = function (owners) {
  if (owners.length === 1) return owners[0];
  const lastOwner = owners.slice().pop(); //slice kore copy kore nisi noito pop mutate krto org array ke
  return owners.join(', ') + ' and ' + lastOwner;
};
console.log(`${formatOwners(ownersTooMuch)}'s dogs eat too much`);

//or

// const tooMuchStr = `${ownersTooMuch
//   .slice(0, 3)
//   .join(', ')} and ${ownersTooMuch.slice(-1)}'s dogs eat too much`;
// console.log(tooMuchStr);

// const tooLittleStr = `${ownersTooLittle.join(' and ')}'s dogs eat too little`;
// console.log(tooLittleStr);

//5.
const exactRecommendFood = dogs.some(dog => dog.recFood === dog.curFood);
const findDog = dogs.find(dog => dog.recFood === dog.curFood).owners;
console.log(findDog);
console.log(exactRecommendFood);

//6.
const calculateOkayFood = dog =>
  dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;

const okayRecommendFood = dogs.every(calculateOkayFood);
console.log(okayRecommendFood);

//7.
const dogsEatingOkay = dogs.filter(calculateOkayFood);
console.log(dogsEatingOkay);

//8.
//array grouping
const dogGroupByPortion = Object.groupBy(dogs, dog =>
  dog.curFood === dog.recFood
    ? 'exact'
    : `${dog.curFood > dog.recFood ? 'tooMuch' : 'tooLittle'}`
);
console.log(dogGroupByPortion);

//or
// const dogGroup = Object.groupBy(dogs, dog => {
//   if (dog.curFood > dog.recFood) {
//     return 'tooMuch';
//   } else if (dog.curFood < dog.recFood) {
//     return 'tooLittle';
//   } else {
//     return 'exact';
//   }
// });
// console.log(dogGroup);

//9.
// const ownerGroup = Object.groupBy(dogs, dog =>
//   dog.owners.length === 1
//     ? 'Single Owner'
//     : `${dog.owners.length > 2 ? 'Dual Ownership' : 'Multiple Ownership'}`
// );
// console.log(ownerGroup);

//or
// const ownerGroup = Object.groupBy(dogs, dog => `${dog.owners.length}--owners`);
// console.log(ownerGroup);

//10.
const recFoodSortAscending = dogs.toSorted((a, b) => a.recFood - b.recFood);
console.log(recFoodSortAscending);
console.log(dogs);
