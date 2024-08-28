const { cpf } = require('cpf-cnpj-validator');
const { differenceInYears } = require('date-fns');

let candidatos = JSON.parse(localStorage.getItem("candidatos")) || [];

// 
function calcularIdade(dataNascimento) {
    return differenceInYears(new Date(), new Date(dataNascimento));
}

function salvar() {
    let id = document.getElementById("id").value;
    let cpfInput = document.getElementById("cpf").value;
    let nome = document.getElementById("nome").value;
    let celular = document.getElementById("celular").value;
    let email = document.getElementById("email").value;
    let nascimento = document.getElementById("nascimento").value;
    let sexo = document.getElementById("sexoMasculino").checked;
    let skillHtml = document.getElementById("skillHtml").checked;
    let skillCss = document.getElementById("skillCss").checked;
    let skillJs = document.getElementById("skillJs").checked;
    let skillBs = document.getElementById("skillBs").checked; // Bootstrap

    const idade = calcularIdade(nascimento);

    //Validação do cpf
    if (!cpf.isValid(cpfInput)) {
        alert("cpf inválido.");
        return;
    }

    //Verif de cpf unico
    if (id === "") {
        let cpfExistente = candidatos.find(e => e.cpf === cpfInput);
        if (cpfExistente) {
            alert("cpf já existe.");
            return;
        }
    }

    // Verif de idade mínima de 16 anos
    if (idade < 16) {
        alert("Candidato deve ter pelo menos 16 anos.");
        return;
    }

    let candidato = {
        id: id !== '' ? id : new Date().getTime(),
        cpf: cpfInput,
        nome: nome,
        celular: celular,
        email: email,
        sexo: sexo ? 'Masculino' : 'Feminino',
        nascimento: nascimento.split('-').reverse().join('/'),
        skills: {
            html: skillHtml,
            css: skillCss,
            js: skillJs,
            Bs: skillBs // Bootstrap
        }
    };

    if (id !== '') {
        let checkCandidato = candidatos.find(e => e.id == candidato.id);
        checkCandidato.cpf = candidato.cpf;
        checkCandidato.nome = candidato.nome;
        checkCandidato.celular = candidato.celular;
        checkCandidato.email = candidato.email;
        checkCandidato.sexo = candidato.sexo;
        checkCandidato.nascimento = candidato.nascimento;
        checkCandidato.skills = candidato.skills;
    } else {
        candidatos.push(candidato);
    }

    // Salvar a lista de candidatos atualizada no local storage
    localStorage.setItem('candidatos', JSON.stringify(candidatos));

    fecharModal();
    listarCandidatos();
}

function listarCandidatos() {
    let tabela = document.getElementById("table-body");
    tabela.innerHTML = '';

    for (let candidato of candidatos) {
        let linha = document.createElement("tr");

        let colunaCpf = document.createElement("td");
        let colunaNome = document.createElement("td");
        let colunaCelular = document.createElement("td");
        let colunaEmail = document.createElement("td");
        let colunaSexo = document.createElement("td");
        let colunaNascimento = document.createElement("td");
        let colunaSkills = document.createElement("td");
        let colunaEditar = document.createElement("td");
        let colunaRemover = document.createElement("td");

        // Funcionalidades botão editar
        let botaoEditar = document.createElement("button");
        botaoEditar.innerHTML = 'Editar';
        botaoEditar.onclick = function () {
            abrirModal(candidato);
        }

        // Funcionalidades botão remover
        let botaoRemover = document.createElement("button");
        botaoRemover.innerHTML = 'Remover';
        botaoRemover.onclick = function () {
            removerCandidato(candidato.id);
        }

        let arrSkills = [];
        if (candidato.skills.html) {
            arrSkills.push('HTML');
        }
        if (candidato.skills.css) {
            arrSkills.push('CSS');
        }
        if (candidato.skills.js) {
            arrSkills.push('JS');
        }
        if (candidato.skills.Bs) { 
            arrSkills.push('BOOTSTRAP');
        }        

        colunaCpf.appendChild(document.createTextNode(candidato.cpf));
        colunaNome.appendChild(document.createTextNode(candidato.nome));
        colunaCelular.appendChild(document.createTextNode(candidato.celular));
        colunaEmail.appendChild(document.createTextNode(candidato.email));
        colunaSexo.appendChild(document.createTextNode(candidato.sexo));
        colunaNascimento.appendChild(document.createTextNode(candidato.nascimento));
        colunaSkills.appendChild(document.createTextNode(arrSkills.join(', ')));
        colunaEditar.appendChild(botaoEditar);
        colunaRemover.appendChild(botaoRemover);

        linha.appendChild(colunaCpf);
        linha.appendChild(colunaNome);
        linha.appendChild(colunaCelular);
        linha.appendChild(colunaEmail);
        linha.appendChild(colunaSexo);
        linha.appendChild(colunaNascimento);
        linha.appendChild(colunaSkills);
        linha.appendChild(colunaEditar);
        linha.appendChild(colunaRemover);

        tabela.appendChild(linha);
    }
}
//função de remover
function removerCandidato(id) {
    candidatos = candidatos.filter(candidato => candidato.id !== id);
    localStorage.setItem('candidatos', JSON.stringify(candidatos));
    listarCandidatos();
}

listarCandidatos();

// Trecho responsável pelo filtro da tabela
$(document).ready(function () {
    $("#search").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#candidatos tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});
