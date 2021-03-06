//sets up code editor
let myCodeMirror = CodeMirror(document.getElementById("input"), {
  value: 'print("hello world")\nmy_set = set()\nmy_list = []\nfor x in range(5):\n\tprint(x)',
  mode: "python",
  theme: "default",
  lineNumbers: true,
  indentWithTabs: true,
  lineWrapping: true,
  autofocus: true,
  fixedGutter: true,
  viewportMargin: Infinity,
});
myCodeMirror.setSize("100%", "100%");

//initializes language state
let lang = "python";

//changes the language mode of the code editor
function changeLanguage(newLang) {
  lang = newLang;
  console.log("Language changed to:", lang);
  myCodeMirror.setOption("mode", lang);
}

// changes theme of the code editor
function changeTheme(newTheme) {
  const theme = newTheme;
  console.log("Theme changed to:", theme);
  myCodeMirror.setOption("theme", theme)
}

// related to dragbar
var left = document.getElementById('input');
var right = document.getElementById('drag-right');
var bar = document.getElementById('dragbar');
var outputText = document.getElementById('outputText');
var app = document.getElementById("app")
var dragContainer = document.getElementById("drag-container")
left.style.width = (window.innerWidth*.7 - bar.offsetWidth / 2) + 'px';
outputText.style.width = window.innerWidth - (window.innerWidth*.7 - bar.offsetWidth / 2) -60 + 'px'

const drag = (e) => {
  document.selection ? document.selection.empty() : window.getSelection().removeAllRanges();
  left.style.width = (e.clientX - bar.offsetWidth / 2) + 'px';

  // arbitrary -60 is not ideal and may not work on all machines?
  outputText.style.width = window.innerWidth - (e.clientX - bar.offsetWidth / 2) -60 + 'px'
}

bar.addEventListener('mousedown', () => {
  document.addEventListener('mousemove', drag);
});

document.addEventListener('mouseup', () => {
  document.removeEventListener('mousemove', drag);
});

//saves on site unload
window.addEventListener(
  "beforeunload",
  (event) => {
    localStorage.setItem("language", lang);
    localStorage.setItem("inputText", myCodeMirror.getValue());
  },
  false
);

//loads on site load
if (localStorage.getItem("language") != null) {
  //gets stored language
  let storedLang = localStorage.getItem("language");
  //sets stored language
  changeLanguage(localStorage.getItem("language"));
  //updates htmls elector
  let selector = document.getElementById("languageSelector");
  for (let i = 0; i < selector.options.length; i++) {
    let option = selector.options[i];
    if (option.value == storedLang) selector.selectedIndex = i;
  }
}
if (localStorage.getItem("inputText") != null) {
  myCodeMirror.setOption("value", localStorage.getItem("inputText"));
}

//query backend
function query() {
  fetch("http://127.0.0.1:3000/submit", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language: lang,
      code: myCodeMirror.getValue(),
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      document.getElementById("outputText").value = `${data.success ? "Code Successfully Run" : "CodeFailed"}\nInput: ${
        data.input
      }\nOutput: ${data.output}\nTime: ${data.time}`;
    });
}
//sets up run button
document.getElementById("run").addEventListener("click", query);
