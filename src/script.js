document.addEventListener('DOMContentLoaded', carregarFuncionarios);
const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const sNome = document.querySelector('#m-nome');
const sFuncao = document.querySelector('#m-funcao');
const sSalario = document.querySelector('#m-salario');
const btnSalvar = document.querySelector('#btnSalvar');
const baseUrl = 'http://localhost:3000/funcionarios';

let itens = [];
let id;

window.loadItens = carregarFuncionarios
window.openModal = openModal;
window.excluirFuncionario = async (id) => {
 await fetch(`${baseUrl}/${id}`, {
    method: 'DELETE'
  });
  carregarFuncionarios();
}

window.editItem = async(index) => {
  const funcionario = await buscarFuncionario(index);
  openModal(true, funcionario);


}

function openModal(editarFuncionario = false, funcionario) {
  modal.classList.add('active');

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active');
    }
  };

  if (editarFuncionario) {
   
    sNome.value = funcionario.nome;
    sFuncao.value = funcionario.funcao;
    sSalario.value = funcionario.salario;
    id = funcionario.id;
  } else {
    sNome.value = '';
    sFuncao.value = '';
    sSalario.value = '';
  }
}

async function cadastroFuncionario(funcionario) {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(funcionario)
  });
  window.location.reload()
  return await response.json();
  
}
async function carregarFuncionarios() {
  const response = await fetch(baseUrl);
  const funcionarios = await response.json();
  tbody.innerHTML = '';
  return funcionarios.forEach(funcionario => {
    tbody.innerHTML += `<tr>${insertItem(funcionario)}</tr>`;
  }
  );
 
}

function insertItem(funcionarios) {
  return `
    <td>${funcionarios.nome}</td>
    <td>${funcionarios.funcao}</td>
    <td>R$ ${funcionarios.salario}</td>
    <td class="acao">
      <button onclick="editItem('${funcionarios.id}')"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="excluirFuncionario('${funcionarios.id}')"><i class='bx bx-trash'></i></button>
    </td>
  `;
}

async function editarFuncionario(funcionario, id) {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(funcionario)
  });
  return  response.json();
}

async function buscarFuncionario(id) {
   const response = await fetch(`${baseUrl}/${id}`);
  return await response.json();
}

btnSalvar.onclick = async e => {
  e.preventDefault();

  if (sNome.value == '' || sFuncao.value == '' || sSalario.value == '') {
    return;
  }

  const funcionario = {
    nome: sNome.value,
    funcao: sFuncao.value,
    salario: sSalario.value
  };

  if (id !== undefined) {
    await editarFuncionario(funcionario, id);
  } else {
    await cadastroFuncionario(funcionario);
  }

  modal.classList.remove('active');
  carregarFuncionarios();
  id = undefined;
};
