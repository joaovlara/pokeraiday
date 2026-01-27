Entendi perfeitamente, João! 👊 Esse mini game tem uma dinâmica bem clara e divertida. Vou organizar a lógica que você descreveu para ficar fácil de implementar em Next.js + Tailwind:

---

## ⚔️ Estrutura da Batalha

### 1. **Sorteio dos Pokémons**
- **Boss**:  
  - Nível fixo: 100  
  - Status: todos no máximo (HP, Attack, Defense, Speed etc.)  
- **Atacantes**:  
  - Sorteio de 8 pokémons aleatórios da POKEAPI  
  - Nível entre 18 e 80 (pode ser randomizado)  
  - Jogador escolhe **5** para formar o time  

---

### 2. **Rodadas e Turnos**
- **Rodada** = ciclo completo de ataques dos pokémons escolhidos + ataques do Boss.  
- **Turno** = ação individual de um Pokémon (ataque ou defesa).  

**Regras:**
- Cada Pokémon do time pode atacar **1 vez por rodada**.  
- O Boss pode atacar **até 2 vezes por rodada**.  
- A rodada termina quando:  
  - Todos os 5 pokémons (ou os sobreviventes) já atacaram.  
  - O Boss já fez seus 2 ataques.  

---

### 3. **Fluxo da Batalha**
1. Jogador escolhe os 5 pokémons.  
2. Inicia a rodada:  
   - Ordem dos turnos pode ser baseada em **Speed** (mais rápido ataca primeiro).  
   - Cada Pokémon ataca uma vez.  
   - O Boss ataca duas vezes (pode ser no início, meio ou fim da rodada, você decide a lógica).  
3. Após a rodada:  
   - Verifica se algum Pokémon morreu (HP ≤ 0).  
   - Verifica se o Boss morreu.  
   - Se ainda houver combatentes vivos, inicia nova rodada.  

---

### 4. **Condições de Vitória**
- **Jogador vence**: Boss derrotado (HP ≤ 0).  
- **Boss vence**: todos os pokémons do jogador derrotados.  
