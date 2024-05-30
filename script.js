
"use strict";

// let gorevListesi = [
//     {"id": 1, "gorevAdi": "Görev 1", "durum": "completed"},
//     {"id": 2, "gorevAdi": "Görev 2", "durum": "completed"},
//     {"id": 3, "gorevAdi": "Görev 3", "durum": "completed"},
//     {"id": 4, "gorevAdi": "Görev 4", "durum": "pending"},
// ];

let gorevListesi = [];

if(localStorage.getItem("gorevListesi") !== null) {
    gorevListesi=JSON.parse(localStorage.getItem("gorevListesi"));
}


let editId;
let isEditTask = false;
let taskInput = document.querySelector("#txtTaskName");
let deleteBtn = document.querySelector("#btnDelete");
let filters = document.querySelectorAll(".filters span")

displayTasks("all");

function displayTasks(filter) {
let ul = document.getElementById("task-list");
ul.innerHTML = "";   //yeni bilgiyi yazdırırken tekrardan fonksiyonu çağırdığımızda eski beilgileri getirmemesi için

if(gorevListesi.length === 0) {
    ul.innerHTML = "<p class='p-3 m-0 text-danger fs-3'> Görev Ekleyiniz</p>"
} else {

    for(let gorev of gorevListesi){

        let completed = gorev.durum === "completed" ? "checked": "";

        // eğer hepsi görünecekse
        if(filter == gorev.durum || filter == "all") {

            let li = `
            <li class="task list-group-item">
                <div class="form-check">
                    <input type="checkbox" onclick="updateStatus(this)" id="${gorev.id}" class="form-check-input" ${completed}>
                    <label for="${gorev.id}" class="form-check-label ${completed}">${gorev.gorevAdi}</label>
                </div>
                <div class="dropdown">
                    <button class="btn btn-link dropdown-toggle" type="button" data-bs-toggle="dropdown"  aria-expanded="false">
                    <i class="fa-solid fa-ellipsis"></i>
                    </button>
                    <ul class="dropdown-menu">
                        <li><a onclick="deleteTask(${gorev.id})" class="dropdown-item" href="#">
                            <i class="fa-solid fa-trash"></i>
                                Delete
                            </a></li>
                        <li><a onclick='editTask(${gorev.id}, "${gorev.gorevAdi}")' class="dropdown-item" href="#">
                            <i class="fa-solid fa-pen"></i>
                                Update
                            </a></li>
                    </ul>
                </div>
            </li>
        `
        ;
        ul.insertAdjacentHTML("beforeend",li);

        }


       

        
}
}  //else kapanışı
}    //displayTasks fonksiyonu







let btnEkle = document.querySelector("#btnAddNewTask");

btnEkle.addEventListener('click', newTask )
document.querySelector("#btnAddNewTask").addEventListener("keypress", function() {
    
    if(event.key == "Enter") {
        document.getElementById("btnAddNewTask").click();
    }
})

// filtreleme işlemi
for(let span of filters) {
    span.addEventListener("click", function() {
        document.querySelector("span.active").classList.remove("active")
        span.classList.add("active")
        displayTasks(span.id);
    })
}

//btn ekle kısmına aittir 
function newTask(event) {

    event.preventDefault(); 

    if(taskInput.value === "" ){
        alert("görev giriniz")
    } else {

        if(!isEditTask) {
            //ekleme
            gorevListesi.push({"id": gorevListesi.length + 1, "gorevAdi": taskInput.value, "durum":"pending"})
        } else {
            //güncelleme
            for(let gorev of gorevListesi) {
                if(gorev.id === editId) {
                    gorev.gorevAdi = taskInput.value;
                }
                isEditTask = false;
            }
        }
        taskInput.value = "";
        displayTasks(document.querySelector("span.active").id);
        localStorage.setItem("gorevListesi",JSON.stringify(gorevListesi));

    console.log(taskInput.value);
    
    }
}


//silme
function deleteTask(id) {

    let deletedId;

    deletedId = gorevListesi.findIndex(gorev => gorev.id === id)

    gorevListesi.splice(deletedId, 1);
    displayTasks(document.querySelector("span.active").id);
    localStorage.setItem("gorevListesi",JSON.stringify(gorevListesi));

    console.log(id);

}


// update
function editTask(taskId,taskName) {

    editId = taskId;
    isEditTask = true;

    taskInput.value = taskName;
    taskInput.focus();
    taskInput.classList.add("active");

    console.log("edit id: ",editId);
    console.log("edit mod", isEditTask);

}


//hepsini sil
deleteBtn.addEventListener("click", function(event) {

    onayla = confirm("silmek istediğne emin misin?")

    if(onayla){
        gorevListesi.splice(0,gorevListesi.length);
        localStorage.setItem("gorevListesi",JSON.stringify(gorevListesi));
        displayTasks();
    } else{
        event.preventDefault();
    }

    
   
})


// tamamlanmış görevler
function updateStatus(selectedTask) {
    //label a ulaşmak için
    // console.log(selectedTask.parentElement.lastElementChild);
    // console.log(selectedTask.nextElementSibling);

    let label = selectedTask.nextElementSibling;
    let durum;

    if(selectedTask.checked) {
        label.classList.add("checked");
        durum = "completed";
    } else {
        label.classList.remove("checked")
        durum = "pending";
    }

    for(let gorev of gorevListesi) {
        if(gorev.id == selectedTask.id) {
            gorev.durum = durum; 
        }
    }

    // yapılacaklarda iken işaretlersek direkt tamamlandıya geçsin
    displayTasks(document.querySelector("span.active").id)
    localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));

    console.log(gorevListesi);
}
