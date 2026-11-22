# desafio_teste_batalha_naval

## Especificação do Desafio

Este repositório contém os casos de teste em **JavaScript** utilizando **Jest** (abordagem **TDD**) para o desafio de **Batalha Naval**, conforme a disciplina de Teste de Software:

* **Dimensões do tabuleiro:** `10 x 10` (10 linhas por 10 colunas, índices de `0` a `9`).
* **Embarcações previstas:**
  * `1` Porta-aviões (`5` casas)
  * `1` Encouraçado (`4` casas)
  * `1` Submarino (`3` casas)
  * `1` Destroier ou Hidroavião (`2` casas)
* **Linguagem e framework de teste:** JavaScript (`CommonJS`) com **Jest**.

---

## Funcionamento dos Casos de Teste

A suíte de testes está em `tests/batalhaNaval.test.js` e valida `criarTabuleiro`, `criarJogoBatalhaNaval`, `posicionarEmbarcacao` e `atirar`:

1. **Tabuleiro `10x10` e frota padrão:** Verifica dimensões `10x10` inicializadas com `null` e os tamanhos da frota (`5`, `4`, `3` e `2`).
2. **Posicionamento válido:** Confirma o posicionamento horizontal e vertical sem sobreposição na grade.
3. **Validação de limites e sobreposição:** Garante lançamento de erro ao ultrapassar a grade `10x10` ou sobrepor embarcações.
4. **Tiros (`agua`, `acerto`, `afundou`) e vitória:** Testa os resultados de cada tiro e a transição de status para `vitoria` ao afundar a frota.
5. **Tiro repetido e coordenadas inválidas:** Rejeita atirar duas vezes na mesma posição ou fora do intervalo `0..9`.

### Como executar os testes

```bash
npm install
npm test
