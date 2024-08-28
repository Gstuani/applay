let candidatos = JSON.parse(localStorage.getItem("candidatos")) || [];

// Função para testar o CPF
function TestaCPF(strCPF) {
    var Soma;
    var Resto;
    Soma = 0;
    if (strCPF == "00000000000") return false;

    for (i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10))) return false;

    Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11))) return false;
    return true;
}

// Função para calcular a idade
function calcularIdade(dataNascimento) {
    const [ano, mes, dia] = dataNascimento.split('-').map(Number);
    const nascimento = new Date(ano, mes - 1, dia);
    const hoje = new Date();

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesDiferenca = hoje.getMonth() - nascimento.getMonth();

    if (mesDiferenca < 0 || (mesDiferenca === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }

    return idade;
}

// Abrir Modal
function abrirModal(candidato) {
    if (candidato) {
        document.getElementById("id").value = candidato.id;
        document.getElementById("cpf").value = (formatarCPF(candidato.cpf)); //Aparecer formatado no Editar
        document.getElementById("nome").value = candidato.nome;
        document.getElementById("celular").value = candidato.celular;
        document.getElementById("email").value = candidato.email;
        if (candidato.sexo == 'Masculino') {
            document.getElementById("sexoMasculino").checked = true;
        } else {
            document.getElementById("sexoFeminino").checked = true;
        }
        document.getElementById("nascimento").value = candidato.nascimento.split('/').reverse().join('-');
        document.getElementById("skillHtml").checked = candidato.skills.html;
        document.getElementById("skillCss").checked = candidato.skills.css;
        document.getElementById("skillJs").checked = candidato.skills.js;
        document.getElementById("skillBs").checked = candidato.skills.Bs;
    }

    $('#candidatoModal').modal('show');
}

// Fechar Modal
function fecharModal() {
    $('#candidatoModal').modal('hide');
    $('body').removeClass('modal-open');
    $('body').removeAttr('style');
    $('.modal-backdrop').remove();

    document.getElementById("id").value = "";
    document.getElementById("cpf").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("celular").value = "";
    document.getElementById("email").value = "";
    document.getElementById("sexoMasculino").checked = true;
    document.getElementById("nascimento").value = '';
    document.getElementById("skillHtml").checked = false;
    document.getElementById("skillCss").checked = false;
    document.getElementById("skillJs").checked = false;
    document.getElementById("skillBs").checked = false;
}

// Função para salvar
function salvar() {
    let id = document.getElementById("id").value;
    let cpf = document.getElementById("cpf").value;
    let nome = document.getElementById("nome").value;
    let celular = document.getElementById("celular").value;
    let email = document.getElementById("email").value;
    let nascimento = document.getElementById("nascimento").value.split('-').reverse().join('/');
    let sexo = document.getElementById("sexoMasculino").checked;
    let skillHtml = document.getElementById("skillHtml").checked;
    let skillCss = document.getElementById("skillCss").checked;
    let skillJs = document.getElementById("skillJs").checked;
    let skillBs = document.getElementById("skillBs").checked;

    cpf = cpf.replace(/\D/g, '');
    if (!TestaCPF(cpf)) {
        Swal.fire('Erro', 'CPF inválido.', 'error');
        return;
    }

    if (id === "") {
        let cpfExistente = candidatos.find(e => e.cpf === cpf);
        if (cpfExistente) {
            Swal.fire('Erro', 'CPF já existente.', 'error');
            return;
        }
    }

    const regexNome = /^[a-zA-ZÀ-ÿ]+(\s[a-zA-ZÀ-ÿ]+)+$/;
    if (!regexNome.test(nome)) {
        Swal.fire('Erro', 'Nome deve ter pelo menos nome e sobrenome, cada um com pelo menos 2 caracteres.', 'error');
        return;
    }

    const idade = calcularIdade(document.getElementById("nascimento").value);
    if (idade < 16) {
        Swal.fire('Erro', 'Candidato deve ter pelo menos 16 anos.', 'error');
        return;
    }

    if (celular.length < 14) {
        Swal.fire('Erro', 'Número de celular incompleto ou inválido.', 'error');
        return false;
    }

    if (email == "" || email.indexOf("@") == -1) {
        Swal.fire('Erro', 'Email inválido ou incompleto.', 'error');
        return false;
    }

    if (nascimento == "") {
        Swal.fire('Erro', 'Coloque uma data de nascimento.', 'error');
        return false;
    }

    if (skillHtml == false && skillCss == false && skillJs == false && skillBs == false) {
        Swal.fire('Erro', 'O candidato deve ter pelo menos uma habilidade.', 'error');
        return false;
    }

    let candidato = {
        id: id != '' ? id : new Date().getTime(),
        cpf: cpf,
        nome: nome,
        celular: celular,
        email: email,
        sexo: sexo ? 'Masculino' : 'Feminino',
        nascimento: nascimento,
        skills: {
            html: skillHtml,
            css: skillCss,
            js: skillJs,
            Bs: skillBs
        }
    };

    if (id != '') {
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

    localStorage.setItem('candidatos', JSON.stringify(candidatos));

    Swal.fire('Sucesso', 'Candidato salvo com sucesso.', 'success').then(() => {
        fecharModal();
        listarCandidatos();
    });
}

// Função para formatar CPF
function formatarCPF(cpf) {
    cpf = cpf.padStart(11, '0');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

// Função para listar candidatos
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

        let botaoEditar = document.createElement("button");
        botaoEditar.className = "btn btn-warning btn-sm"; // deixar o botão bonito
        botaoEditar.innerHTML = '<i class="fas fa-edit"></i>'; 
        botaoEditar.onclick = function () {
            abrirModal(candidato);
        }

        let botaoRemover = document.createElement("button");
        botaoRemover.className = "btn btn-danger btn-sm"; // deixar o botão bonito
        botaoRemover.innerHTML = '<i class="fas fa-trash"></i>';
        botaoRemover.onclick = function () {
            removerCandidato(candidato.id);
        }

        let arrSkills = [];
        if (candidato.skills.html) arrSkills.push('HTML');
        if (candidato.skills.css) arrSkills.push('CSS');
        if (candidato.skills.js) arrSkills.push('JS');
        if (candidato.skills.Bs) arrSkills.push('Bootstrap');

        colunaCpf.appendChild(document.createTextNode(formatarCPF(candidato.cpf)));//Aparecer formatado na lista
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

// Função para remover candidato
function removerCandidato(id) {
    Swal.fire({
        title: 'Ccerteza?',
        text: "Não da pra reverter",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, remove',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            candidatos = candidatos.filter(candidato => candidato.id !== id);
            localStorage.setItem('candidatos', JSON.stringify(candidatos));
            listarCandidatos();
            Swal.fire('Removido', 'Candidato foi removido.', 'success');
        }
    });
}

listarCandidatos();

$(document).ready(function() {
    $('#cpf').mask('000.000.000-00', {reverse: true});
    $('#celular').mask('(00) 00000-0000');
});

$(document).ready(function () {
    $("#search").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#candidatos tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});
