let passwordLength = 8;
let isUpperCase = false;
let isNumbers = false;
let isSymbols = false;

const passwordRangeInputEl = document.getElementById("passRangeInput");
const passRangeValueEl = document.getElementById("passRangeValue");
const btn = document.getElementById("btn");
const passwordEl = document.getElementById("password");

const generatePassword = (passLength) => {
  const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
  const upperCaseLetters = isUpperCase ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "";
  const numbers = isNumbers ? "0123456789" : "";
  const symbols = isSymbols ? "!@#$%^&*()_+" : "";

  let passwordChar = lowerCaseLetters + upperCaseLetters + numbers + symbols;

  // Ensure at least one character type is selected
  if (passwordChar.length === 0) {
    alert("Please select at least one character type.");
    return "";
  }

  let password = "";
  for (let i = 0; i < passLength; i++) {
    const charIndex = Math.floor(Math.random() * passwordChar.length);
    password += passwordChar[charIndex];
  }

  return password;
};

// Update range value display
passwordRangeInputEl.addEventListener("input", (e) => {
  passwordLength = +e.target.value;
  passRangeValueEl.innerText = passwordLength;
});

// Generate password on button click
btn.addEventListener("click", () => {
  const upperCaseCheckEl = document.getElementById("uppercase");
  const numbersCheckEl = document.getElementById("numbers");
  const symbolsCheckEl = document.getElementById("symbols");

  isUpperCase = upperCaseCheckEl.checked;
  isNumbers = numbersCheckEl.checked;
  isSymbols = symbolsCheckEl.checked;

  const password = generatePassword(passwordLength);
  if (password) {
    passwordEl.textContent = password;
    console.log("Generated Password:", password);
  }
});

// Copy password to clipboard on click
passwordEl.addEventListener("click", () => {
  if (passwordEl.textContent.length > 0) {
    navigator.clipboard
      .writeText(passwordEl.textContent)
      .then(() => {
        alert("Copied to clipboard");
      })
      .catch(() => {
        alert("Could not copy");
      });
  }
});
let btnmode=document.querySelector("#mode");
let body=document.querySelector("body");
let currMode="light";
btnmode.addEventListener("click",()=>{
    if (currMode==="light") {
        currMode="dark";
        body.classList.add("dark");
        body.classList.remove("light");
    }else{
        currMode="light";
        body.classList.add("light");
        body.classList.remove("dark");
    }

    console.log(currMode);
});