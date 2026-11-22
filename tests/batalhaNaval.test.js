const {
  TAMANHO,
  FROTA_PADRAO,
  criarTabuleiro,
  criarJogoBatalhaNaval,
  posicionarEmbarcacao,
  atirar,
} = require('../src/batalhaNaval');

describe('Batalha Naval 10x10', () => {
  test('deve criar um tabuleiro 10x10 vazio e definir a frota padrão', () => {
    const tabuleiro = criarTabuleiro();
    expect(tabuleiro).toHaveLength(TAMANHO);
    for (const linha of tabuleiro) {
      expect(linha).toHaveLength(TAMANHO);
      expect(linha.every((c) => c === null)).toBe(true);
    }

    expect(FROTA_PADRAO.map((n) => n.tamanho)).toEqual([5, 4, 3, 2]);
  });

  test('deve posicionar embarcações horizontal e verticalmente sem sobreposição', () => {
    let jogo = criarJogoBatalhaNaval();
    jogo = posicionarEmbarcacao(jogo, {
      nome: 'Porta-aviões',
      tamanho: 5,
      linha: 0,
      coluna: 0,
      orientacao: 'H',
    });
    jogo = posicionarEmbarcacao(jogo, {
      nome: 'Encouraçado',
      tamanho: 4,
      linha: 2,
      coluna: 1,
      orientacao: 'V',
    });

    expect(jogo.embarcacoes).toHaveLength(2);
    expect(jogo.grade[0].slice(0, 5)).toEqual([0, 0, 0, 0, 0]);
    expect([jogo.grade[2][1], jogo.grade[3][1], jogo.grade[4][1], jogo.grade[5][1]]).toEqual([
      1, 1, 1, 1,
    ]);
  });

  test('deve rejeitar embarcação fora dos limites 10x10 ou sobreposta', () => {
    let jogo = criarJogoBatalhaNaval();

    // Ultrapassa limite horizontal (coluna 7 + tamanho 5 > 9)
    expect(() =>
      posicionarEmbarcacao(jogo, {
        nome: 'Porta-aviões',
        tamanho: 5,
        linha: 0,
        coluna: 7,
        orientacao: 'H',
      })
    ).toThrow();

    jogo = posicionarEmbarcacao(jogo, {
      nome: 'Submarino',
      tamanho: 3,
      linha: 4,
      coluna: 4,
      orientacao: 'H',
    });

    // Sobrepõe célula (4, 5)
    expect(() =>
      posicionarEmbarcacao(jogo, {
        nome: 'Destroier',
        tamanho: 2,
        linha: 3,
        coluna: 5,
        orientacao: 'V',
      })
    ).toThrow();
  });

  test('deve registrar tiro na água, acerto e afundamento de embarcação', () => {
    let jogo = criarJogoBatalhaNaval();
    jogo = posicionarEmbarcacao(jogo, {
      nome: 'Destroier',
      tamanho: 2,
      linha: 1,
      coluna: 1,
      orientacao: 'H',
    });

    let res = atirar(jogo, 0, 0);
    expect(res.resultado).toBe('agua');
    jogo = res.estado;

    res = atirar(jogo, 1, 1);
    expect(res.resultado).toBe('acerto');
    expect(res.embarcacao.afundada).toBe(false);
    jogo = res.estado;

    res = atirar(jogo, 1, 2);
    expect(res.resultado).toBe('afundou');
    expect(res.embarcacao.afundada).toBe(true);
    expect(res.estado.status).toBe('vitoria');
  });

  test('deve rejeitar tiro repetido ou coordenada fora do tabuleiro 10x10', () => {
    let jogo = criarJogoBatalhaNaval();
    jogo = posicionarEmbarcacao(jogo, {
      nome: 'Submarino',
      tamanho: 3,
      linha: 5,
      coluna: 5,
      orientacao: 'H',
    });

    const primeiroTiro = atirar(jogo, 5, 5);
    jogo = primeiroTiro.estado;

    expect(() => atirar(jogo, 5, 5)).toThrow();
    expect(() => atirar(jogo, -1, 0)).toThrow();
    expect(() => atirar(jogo, 0, 10)).toThrow();
  });
});