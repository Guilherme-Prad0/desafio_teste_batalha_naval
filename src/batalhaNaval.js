const TAMANHO = 10;

const FROTA_PADRAO = [
  { nome: 'Porta-aviões', tamanho: 5 },
  { nome: 'Encouraçado', tamanho: 4 },
  { nome: 'Submarino', tamanho: 3 },
  { nome: 'Destroier', tamanho: 2 },
];

function criarTabuleiro(tamanho = TAMANHO) {
  return Array.from({ length: tamanho }, () => Array(tamanho).fill(null));
}

function validarCoordenada(linha, coluna, tamanho = TAMANHO) {
  if (!Number.isInteger(linha) || linha < 0 || linha >= tamanho) {
    throw new RangeError(`Linha inválida: ${linha}. Deve estar entre 0 e ${tamanho - 1}.`);
  }
  if (!Number.isInteger(coluna) || coluna < 0 || coluna >= tamanho) {
    throw new RangeError(`Coluna inválida: ${coluna}. Deve estar entre 0 e ${tamanho - 1}.`);
  }
}

function calcularPosicoesEmbarcacao(linha, coluna, tamanhoNavio, orientacao) {
  if (orientacao !== 'H' && orientacao !== 'V') {
    throw new Error(`Orientação inválida: ${orientacao}. Use 'H' ou 'V'.`);
  }

  const posicoes = [];
  for (let i = 0; i < tamanhoNavio; i++) {
    const l = orientacao === 'V' ? linha + i : linha;
    const c = orientacao === 'H' ? coluna + i : coluna;
    validarCoordenada(l, c, TAMANHO);
    posicoes.push({ linha: l, coluna: c });
  }
  return posicoes;
}

function criarJogoBatalhaNaval() {
  return {
    tamanho: TAMANHO,
    grade: criarTabuleiro(TAMANHO),
    tiros: Array.from({ length: TAMANHO }, () => Array(TAMANHO).fill(false)),
    embarcacoes: [],
    status: 'em_andamento',
  };
}

function posicionarEmbarcacao(estado, { nome, tamanho, linha, coluna, orientacao = 'H' }) {
  if (estado.status !== 'em_andamento') {
    throw new Error('O jogo já foi encerrado.');
  }

  const posicoes = calcularPosicoesEmbarcacao(linha, coluna, tamanho, orientacao);

  for (const pos of posicoes) {
    if (estado.grade[pos.linha][pos.coluna] !== null) {
      throw new Error(`Posição (${pos.linha}, ${pos.coluna}) já está ocupada por outra embarcação.`);
    }
  }

  const id = estado.embarcacoes.length;
  const novaGrade = estado.grade.map((l) => [...l]);

  for (const pos of posicoes) {
    novaGrade[pos.linha][pos.coluna] = id;
  }

  const novaEmbarcacao = {
    id,
    nome,
    tamanho,
    posicoes,
    acertos: 0,
    afundada: false,
  };

  return {
    ...estado,
    grade: novaGrade,
    embarcacoes: [...estado.embarcacoes, novaEmbarcacao],
  };
}

function verificarVitoria(embarcacoes) {
  return embarcacoes.length > 0 && embarcacoes.every((navio) => navio.afundada);
}

function atirar(estado, linha, coluna) {
  if (estado.status !== 'em_andamento') {
    throw new Error('O jogo já foi encerrado.');
  }

  validarCoordenada(linha, coluna, estado.tamanho);

  if (estado.tiros[linha][coluna]) {
    throw new Error(`Coordenada (${linha}, ${coluna}) já foi atingida anteriormente.`);
  }

  const novosTiros = estado.tiros.map((l) => [...l]);
  novosTiros[linha][coluna] = true;

  const alvoId = estado.grade[linha][coluna];
  if (alvoId === null) {
    return {
      estado: {
        ...estado,
        tiros: novosTiros,
      },
      resultado: 'agua',
      embarcacao: null,
    };
  }

  const novasEmbarcacoes = estado.embarcacoes.map((navio) => {
    if (navio.id !== alvoId) {
      return navio;
    }
    const novosAcertos = navio.acertos + 1;
    const afundada = novosAcertos >= navio.tamanho;
    return {
      ...navio,
      acertos: novosAcertos,
      afundada,
    };
  });

  const navioAtingido = novasEmbarcacoes.find((n) => n.id === alvoId);
  const venceu = verificarVitoria(novasEmbarcacoes);

  return {
    estado: {
      ...estado,
      tiros: novosTiros,
      embarcacoes: novasEmbarcacoes,
      status: venceu ? 'vitoria' : 'em_andamento',
    },
    resultado: navioAtingido.afundada ? 'afundou' : 'acerto',
    embarcacao: navioAtingido,
  };
}

module.exports = {
  TAMANHO,
  FROTA_PADRAO,
  criarTabuleiro,
  criarJogoBatalhaNaval,
  posicionarEmbarcacao,
  atirar,
};