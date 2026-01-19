### Overview

Este repositório implementa um **mini game inspirado em Raids de Pokémon**. O jogador enfrenta um **boss** único e poderoso enquanto monta uma equipe de cinco Pokémon para derrotá‑lo. O jogo usa a **PokéAPI** como fonte de dados para sprites, stats e movimentos, e foi desenvolvido com **Next.js** e **Tailwind CSS**.

---

### Gameplay

- **Objetivo**  
  - **Vencer**: reduzir o HP do boss a zero.  
  - **Perder**: todos os cinco Pokémon da sua equipe ficam com HP zero.

- **Setup da Raid**  
  - Um **boss aleatório** é gerado no **nível 100** com **IV = 31**.  
  - O jogador recebe **8 candidatos** aleatórios; cada candidato tem nível aleatório até 70.  
  - O jogador escolhe **5** entre os 8 para formar a equipe.

- **Fluxo de batalha**  
  - A batalha é por **turnos**. Em cada round todos os combatentes vivos agem **uma vez**.  
  - A **ordem de ação** é determinada pelo stat **Speed** em ordem decrescente.  
  - Cada ação é um ataque simples que aplica dano ao alvo. O boss ataca um alvo aleatório vivo da equipe.  
  - O round termina quando todos os combatentes vivos agiram. Em seguida verifica‑se condição de vitória ou derrota.

---

### Technical Details

- **Fontes de dados**  
  - Dados de Pokémon e movimentos são obtidos da **PokéAPI**.  
  - Sprites, base stats e lista de movimentos são usados para construir os combatentes.

- **Cálculo de stats**  
  - **HP** é calculado com a fórmula clássica:
  \[
  \text{HP} = \left\lfloor\frac{(2 \cdot \text{base} + \text{IV} + \frac{\text{EV}}{4}) \cdot \text{level}}{100}\right\rfloor + \text{level} + 10
  \]
  - **Outros stats** (Attack, Defense, Speed) usam:
  \[
  \text{Stat} = \left\lfloor\frac{(2 \cdot \text{base} + \text{IV} + \frac{\text{EV}}{4}) \cdot \text{level}}{100}\right\rfloor + 5
  \]
  - **Parâmetros usados no protótipo**  
    - **IV** = 31 para boss e candidatos.  
    - **EV** = 0.  
    - **Natureza** neutra (sem modificadores).

- **Fórmula de dano**  
  - Dano inspirado na fórmula oficial, simplificada e balanceada:
  \[
  \text{base} = \left\lfloor\frac{\left(\left(\frac{2 \cdot \text{level}}{5}\right) + 2\right) \cdot \text{power} \cdot \text{atk}}{\text{def}}\div 50\right\rfloor + 2
  \]
  - Aplica‑se um multiplicador aleatório \(r\) entre 0.85 e 1.0:
  \[
  \text{damage} = \max(1, \lfloor \text{base} \cdot r \rfloor)
  \]
  - **Power** do movimento é buscado na PokéAPI quando disponível; caso contrário usa‑se um valor padrão (exemplo 50 para aliados, 60 para boss).

- **Turnos e ordem**  
  - Em cada round constrói‑se a lista de participantes vivos.  
  - Ordena‑se por **Speed** decrescente.  
  - Executa‑se cada ação sequencialmente com pequenas pausas para animação/feedback.

- **Decisões de design**  
  - Movimentos com efeitos secundários, precisão, PP e tipos não são aplicados no protótipo inicial.  
  - O boss usa ataques genéricos com power maior para representar maior ameaça.  
  - Logs de combate registram cada ação para feedback do jogador.

---

### Project Structure and Run

- **Arquivos principais**
  - `app/page.tsx` Página de seleção e setup da raid.  
  - `app/raid/setup/page.tsx` Geração do boss e dos 8 candidatos; UI para escolher 5.  
  - `app/raid/battle/page.tsx` Loop de rounds, ordem por Speed, aplicação de dano e log.  
  - `lib/pokemonUtils.ts` Funções utilitárias: cálculo de stats, construção de combatantes e cálculo de dano.  
  - `lib/raidGenerator.ts` Funções para buscar Pokémon aleatórios na PokéAPI e montar boss/candidatos.