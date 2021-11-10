//sets up code editor
var myCodeMirror = CodeMirror(document.getElementById("input"), {
  value: 'print("hello world")\nmy_set = set()\nmy_list = []\nfor x in range(5):\n\tprint(x)',
  mode: "python",
  lineNumbers: true,
  indentWithTabs: true,
  lineWrapping: true,
  autofocus: true,
  fixedGutter: true,
  viewportMargin: Infinity,
});
myCodeMirror.setSize("100%", "100%");

//changes the language mode of the code editor
function changeLanguage(lang) {
  console.log("Language changed to: " lang);
  myCodeMirror.setOption("mode", lang);
}
