window.onload = getTarefas();

let txtTarefa = document.getElementById("tarefa");
let txtNome = document.getElementById("nome");
let txtPrazo = document.getElementById("prazo");
let btnAddTarefa = document.getElementById("btnAddTarefa");
let tblToDo = document.getElementById("tblToDo");
let tblDone = document.getElementById("tblDone");

let addTarefa = function() {
    let tarefa = txtTarefa.value;
    let nome = txtNome.value;
    let prazo = txtPrazo.value;
    let row = criaNovaLinha(tarefa, nome, prazo);

    tblToDo.appendChild(row);
    
    // limpa campos para nova edição
    txtTarefa.value = "";
    txtNome.value = "";
    txtPrazo.value = Today();

    // constrói objeto para enviar ao servidor
    let objTarefa = {
        id: 0,
        tarefa: tarefa,
        responsavel: nome,
        prazo: prazo,
        feita: false
    };

    return objTarefa;
}

function addTarefas(taskList) {
    taskList.forEach(item => {
     let row = criaNovaLinha(item.tarefa, item.responsavel, item.prazo);
     if (item.feita) {
         tblDone.appendChild(row);
     }
     else {
         tblToDo.appendChild(row);
     }
    });
}

let criaNovaLinha = function(tarefa, nome, prazo) {
    let tr = document.createElement("tr");

    let tdTarefa = document.createElement("td");
    let tdNome = document.createElement("td");
    let tdPrazo = document.createElement("td");
    let tdAcao = document.createElement("td");
    
    tdTarefa.innerHTML = tarefa;
    tdNome.innerHTML = nome;
    tdPrazo.innerHTML = prazo;
    
    let btnRemover = document.createElement("button");
    let btnMarcar = document.createElement("button");
    let btnEditar = document.createElement("button");
    btnRemover.innerHTML = '<i class="fa fa-trash"></i>';
    btnMarcar.innerHTML  = '<i class="fa fa-check"></i>';
    btnEditar.innerHTML  = '<i class="fa fa-edit"></i>';
    btnRemover.className = 'w3-button w3-circle w3-red';
    btnMarcar.className = 'w3-button w3-circle w3-blue';
    btnEditar.className = 'w3-button w3-circle w3-green';
    btnRemover.onclick = delTarefa;
    btnMarcar.onclick = marcarFeita;
    btnEditar.onclick = editarTarefa;
    tdAcao.appendChild(btnRemover);
    tdAcao.appendChild(btnMarcar);
    tdAcao.appendChild(btnEditar);
    
    tr.appendChild(tdTarefa);
    tr.appendChild(tdNome);
    tr.appendChild(tdPrazo);
    tr.appendChild(tdAcao);
    
    return tr;
}

let delTarefa = function() {
    let row = this.parentNode.parentNode;
    let table = row.parentNode;
    table.removeChild(row);
}

let marcarFeita = function() {
    let row = this.parentNode.parentNode;
    let table = this.parentNode.parentNode.parentNode;;
    let btnMarcar = row.children[3].children[1];
    btnMarcar.className = 'w3-button w3-circle w3-blue';
    if (table.id === 'tblToDo') {
        tblDone.appendChild(row);
        btnMarcar.innerHTML  = '<i class="fa fa-times"></i>';
        // btnMarcar.innerHTML = "Voltar para a fazer";
    }
    else {
        tblToDo.appendChild(row);
        btnMarcar.innerHTML  = '<i class="fa fa-check"></i>';
        // btnMarcar.innerHTML = "Marcar como feita";
    }
}

let editarTarefa = function() {
    let tarefaEditada = prompt("Edite a tarefa");
    let tarefaAntiga = this.parentNode.parentNode.children[0].innerHTML;
    this.parentNode.parentNode.children[0].innerHTML = tarefaEditada;
}

let Today = function () {
    return new Date().toLocaleString().substr(0, 10);
}

btnAddTarefa.addEventListener("click", postTarefa);
txtPrazo.value = Today();

function getTarefas() {
    let taskRequest = new XMLHttpRequest();
    taskRequest.open('GET', 'http://localhost:3000/tarefas.json');
    taskRequest.onload = function() {
        console.log("Conectou... Status: "+taskRequest.status);
        if (taskRequest.status >= 200 && taskRequest.status < 400) {
            let taskList = JSON.parse(taskRequest.responseText);
            addTarefas(taskList);
        } else {
            console.log("Servidor ativo, mas ocorreu um erro!");
        }
    };
    taskRequest.onerror = function() {
        console.log("Erro de conexão");
    }
    taskRequest.send();  
}

function postTarefa() {
    let taskRequest = new XMLHttpRequest();
    let taskList;
    taskRequest.open('POST', 'http://localhost:3000/tarefas.json');
    let tarefa = addTarefa();
    taskList = JSON.stringify(tarefa);
    console.log(taskList);
    taskRequest.onerror = function() {
        console.log("Erro de conexão");
    }
    taskRequest.send(taskList);  
}