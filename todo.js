const form = document.querySelector("#todo-form"); // todo-form adındaki formu seçer
const todoInput = document.querySelector("#todo"); //todo inputunu id'ye gore sectik
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListener();



function eventListener() { // Tum event listenerlari atar
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", loadAllTodosUI);//sayfa yuklendiginde calisir
    secondCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup", filterTodos);
    clearButton.addEventListener("click", deleteAllTodo);
}
function deleteAllTodo() {
    if (confirm("Are you sure?")) {
        while (todoList.firstElementChild != null) {
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos");
    }

}
function filterTodos(e) {
    const filterValue = e.target.value.toLowerCase();
    const listItem = document.querySelectorAll(".list-group-item");

    listItem.forEach(function (listItem) {
        const text = listItem.textContent.toLowerCase();
        if (text.indexOf(filterValue) === -1) {
            //bulamadi
            listItem.setAttribute("style", "display : none !important"); //liste itemlerine gorunmez yapar
        }
        else {
            listItem.setAttribute("style", "display : block");
        }
    });
}

function deleteTodo(e) {
    if (e.target.className === "fa fa-remove") { // eger sadece silme butonlarina tiklandiysa
        //e.target eventin tetiklenen ogesi

        e.target.parentElement.parentElement.remove();//silinmesi gereken liste carpi butonun 2 üst elementidir bu yuzden iki ust ebeveyne ciktik

        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent.trim());
        showAlert("success", "Todo added successfully...");
    }
}

function deleteTodoFromStorage(deletetodo) {
    let todos = getTodosFromStorage();

    todos.forEach(function (todo, index) { //index elemanini js forEach gonderir zaten
        if (todo === deletetodo) {

            todos.splice(index, 1); // todos arrayinde indexten itibaren 1 eleman siler
        }
    });//icerik esit olursa 
    localStorage.setItem("todos", JSON.stringify(todos));// localstorage'da yeni degeri gunceller 
}

function loadAllTodosUI() {
    let todos = getTodosFromStorage();

    todos.forEach(function (todo) {// tum todos icerisindeki elemanlar uzerinde gezer
        addTodoUI(todo);
    })
}

function addTodo(e) {
    let todos = getTodosFromStorage();
    const newTodo = todoInput.value.trim();// trim bastaki ve sondaki bosluklari siler

    if (newTodo === "") {
        showAlert("danger", " Failed! Please enter input ...");
    }
    else {
        let count = 0;
        if (todos.length != 0) {
            todos.forEach(function (todo) {
                if (todo === newTodo) {
                    count++;
                }
            });
            if (count == 0) {
                addTodoUI(newTodo); // arayuze ekle
                addTodoStorage(newTodo);
                showAlert("success", " Todo added successfully...");
            }
            else {
                showAlert("warning", newTodo + " todo name has been used before...");
            }
        }
        else {
            addTodoUI(newTodo); // arayuze ekle
            addTodoStorage(newTodo);
            showAlert("success", " Todo added successfully...");
        }
    }
    e.preventDefault(); //form sayfaya tekrardan yonlenmesin diye
    // sayfayi yenilemeyi engeller
}

function getTodosFromStorage() { // todos arrayini storage'dan getirir
    let todos;
    if (localStorage.getItem("todos") === null) { // todos adinda bir key var mi kontrolu
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos"));
        // JSON.parse stringi arraye cevirir
    }
    return todos;
}

function addTodoStorage(newTodo) { //storage'a atama
    let todos = getTodosFromStorage();
    todos.push(newTodo);//todos arrayine newTodo'yu ekler

    localStorage.setItem("todos", JSON.stringify(todos));//localStorage'daki todos keyine sahip arraye todos icerisindeki degerleri stringe cevirip localStorage'a atar

}

function showAlert(type, message) {
    const alert = document.createElement("div");

    alert.className = `alert alert-${type}`;

    alert.textContent = message;
    firstCardBody.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 1000);//1 sn sonra calisir
}
function addTodoUI(newTodo) { //aldigi degeri list item olarak UI'ye ekleyecek

    //list item olusturma
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-around";

    // silme butonu olusturma carpi olan
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = " <i class='fa fa-remove'></i>";

    //alinan texti ekleme
    listItem.appendChild(document.createTextNode(newTodo));

    //linki list item'a child olarak atama
    listItem.appendChild(link);

    //ul'ye list'i ekleme
    todoList.appendChild(listItem);

    todoInput.value = "";// yukleme islemi yapildiktan sonra inputun icerigini sifirlar
}