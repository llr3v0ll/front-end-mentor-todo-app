//  THEME TOGGLE
const themebutton = document.querySelector("#theme-change"),
  body = document.querySelector("body");

function changeTheme() {
  body.classList.toggle("dark-theme");
  body.classList.toggle("light-theme");
}

themebutton.addEventListener("click", changeTheme);

// TODO LIST
const form = document.forms["input-form"],
  input = form.elements["todo-input"],
  ul = document.querySelector("ul"),
  listfooter = document.querySelector(".list-footer"),
  dragdropP = document.querySelector(".drag-drop-p"),
  itemsleft = document.querySelector("#items-left"),
  delbut = document.querySelector("#del"),
  filter = document.querySelector(".filters"),
  filterRadio = document.getElementsByName("filter");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
var liDragged;
// FUNCTIONS
function addTodo(event) {
  event.preventDefault();
  if (input.value.trim() == "") {
    return;
  }
  const label = input.value.trim();
  const complete = false;

  todos = [...todos, { label, complete }];

  renderTodos(todos);
  saveToStorage(todos);
  input.value = "";
}
function renderTodos() {
  if (todos.length == 0) {
    listfooter.style.display = "none";
    dragdropP.style.display = "none";
  } else {
    listfooter.style.display = "flex";
    dragdropP.style.display = "block";
    if (screen.width < 501) {
      dragdropP.style.visibility = "hidden";
    }
  }
  let num = 0;
  let todoString = "";
  todos.forEach((listitem, index) => {
    todoString += `
   <li draggable="true" ondragstart="drag(event)" ondragover="dragover(event)" ondrop="dragdrop(event)" ondragleave="dragleave(event)" data-id="${index}">
   <label>
     <input type="checkbox" name="todo-check"${
       listitem.complete == false ? "" : " checked"
     }/>
     <span class="custom-checkbox"></span>
     <p style="margin-top: 5px;">${listitem.label}</p>
   </label>
   <img src="images/icon-cross.svg" alt="cross" class="delete-one-todo">
   </li>`;
    if (listitem.complete == false) {
      num += 1;
    }
  });

  ul.innerHTML = todoString;
  itemsleft.innerText = num;
  filterRadio[0].checked = true;
}
function updateTodo(event) {
  const id = event.target.parentNode.parentNode.getAttribute("data-id");
  const changeComplete = event.target.checked;

  todos.map((listitem, index) => {
    if (index == id) {
      listitem.complete = changeComplete;
    }
  });
  let falseval = 0;
  todos.forEach((listitem) => {
    if (listitem.complete == false) {
      falseval += 1;
    }
  });
  itemsleft.innerText = falseval;
  filterTodo();
  saveToStorage(todos);
}
function delTodo() {
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].complete == true) {
      todos.splice(i, 1);
      i -= 1;
    }
  }
  renderTodos();
  saveToStorage(todos);
}
function delOne(event) {
  if (event.target.nodeName != "IMG") {
    return;
  }
  const id = event.target.parentNode.getAttribute("data-id");
  todos.splice(id, 1);
  renderTodos();
  saveToStorage(todos);
}
function filterTodo() {
  var listitems = Array.from(ul.children);
  filterRadio.forEach((radiobut) => {
    if (radiobut.checked == true) {
      if (radiobut.value == "all") {
        listitems.forEach((item) => {
          item.classList.add("li-show");
          item.classList.remove("li-hide");
        });
      } else if (radiobut.value == "active") {
        listitems.forEach((item, index) => {
          if (todos[index].complete == false) {
            item.classList.add("li-show");
            item.classList.remove("li-hide");
          } else {
            item.classList.add("li-hide");
            item.classList.remove("li-show");
          }
        });
      } else {
        listitems.forEach((item, index) => {
          if (todos[index].complete == true) {
            item.classList.add("li-show");
            item.classList.remove("li-hide");
          } else {
            item.classList.add("li-hide");
            item.classList.remove("li-show");
          }
        });
      }
    }
  });
}
function dragover(event) {
  event.preventDefault();
  const string = event.target.outerHTML;
  if (string.slice(1, 3) == "li") {
    var colorUnderline = event.target;
  } else if (string.slice(1, 6) == "label" || string.slice(1, 4) == "img") {
    var colorUnderline = event.target.parentNode;
  } else {
    var colorUnderline = event.target.parentNode.parentNode;
  }
  colorUnderline.style = "border-bottom:1px solid hsl(220, 98%, 61%)";
}
function drag(event) {
  return (liDragged = event.target.getAttribute("data-id"));
}
function dragdrop(event) {
  event.preventDefault();
  const string = event.target.outerHTML;
  if (string.slice(1, 3) == "li") {
    var pushAfter = event.target.getAttribute("data-id");
  } else if (string.slice(1, 6) == "label" || string.slice(1, 4) == "img") {
    var pushAfter = event.target.parentNode.getAttribute("data-id");
  } else {
    var pushAfter = event.target.parentNode.parentNode.getAttribute("data-id");
  }

  const removedTodo = todos.splice(liDragged, 1);
  todos.splice(pushAfter, 0, removedTodo[0]);
  renderTodos();
  saveToStorage(todos);
}
function dragleave(event) {
  event.preventDefault();
  const string = event.target.outerHTML;
  if (string.slice(1, 3) == "li") {
    var colorUnderline = event.target;
  } else if (string.slice(1, 6) == "label" || string.slice(1, 4) == "img") {
    var colorUnderline = event.target.parentNode;
  } else {
    var colorUnderline = event.target.parentNode.parentNode;
  }

  if (body.classList.value == "dark-theme") {
    colorUnderline.style = "border-bottom:1px solid hsl(233, 14%, 35%)";
  } else {
    colorUnderline.style = "border-bottom:1px solid hsl(236, 33%, 92%)";
  }
}
function saveToStorage(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}
// init
function init() {
  renderTodos(todos);
  // add todo
  form.addEventListener("submit", addTodo);
  // update
  ul.addEventListener("change", updateTodo);
  // delete
  delbut.addEventListener("click", delTodo);
  ul.addEventListener("click", delOne);
  //filters
  filter.addEventListener("change", filterTodo);
  // drag & drop
}
init();
