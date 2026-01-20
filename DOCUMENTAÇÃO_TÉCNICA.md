# Documentação Técnica - PokeAPI Raid Simulator

## Visão Geral do Projeto

**PokeAPI Raid Simulator** é uma aplicação web interativa construída com Next.js/React que simula batalhas tipo "Raid" do Pokémon Pokémon. O usuário seleciona 5 Pokémon para formar uma equipe e enfrenta um boss randomizado em um sistema de combate por turnos.

### Stack Tecnológico
- **Frontend**: React 19.2.3 com Next.js 16.1.3
- **Linguagem**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **API Externa**: PokeAPI (https://pokeapi.co/api/v2/)
- **Gerenciam de Estados**: React Hooks (useState, useEffect)

---

## Arquitetura do Projeto

### Estrutura de Diretórios

```
pokeapi/
├── app/                          # Código da aplicação Next.js
│   ├── globals.css              # Estilos globais
│   ├── layout.tsx               # Layout raiz
│   ├── page.tsx                 # Página inicial (Home)
│   ├── components/              # Componentes reutilizáveis
│   │   ├── BossSection.tsx
│   │   ├── CandidateCard.tsx
│   │   ├── CandidatesSection.tsx
│   │   └── RaidTip.tsx
│   └── raid/
│       └── battle/
│           ├── page.tsx         # Página da batalha
│           └── components/      # Componentes da batalha
│               ├── BattleControls.tsx
│               ├── BattleLog.tsx
│               ├── BossBattle.tsx
│               ├── TeamMemberCard.tsx
│               └── TeamSection.tsx
│
├── libs/                        # Lógica de negócio compartilhada
│   ├── pokemonUtils.ts          # Utilitários e cálculos de Pokémon
│   ├── raidEngine.ts            # Motor de batalha (não usado atualmente)
│   ├── raidGenerator.ts         # Gerador de Pokémon randomizado
│   └── typeChart.ts             # Tabela de efetividade de tipos
│
├── types/                       # Definições de tipos TypeScript
│   └── pokemon.ts               # Interfaces de dados
│
└── config files
    ├── package.json
    ├── tsconfig.json
    ├── next.config.ts
    ├── tailwind.config.mjs
    └── eslint.config.mjs
```

---

## Entidades e Tipos de Dados

### 1. **RawPokemon** (Dados Brutos da API)
```typescript
interface RawPokemon {
  id: number;
  name: string;
  sprites: { front_default: string };           // URL da sprite
  stats: {                                        // Stats base do Pokémon
    base_stat: number;
    stat: { name: string }                       // ex: "hp", "attack", "defense"
  }[];
  moves?: {                                       // Movimentos disponíveis
    move: { name: string; url: string }
  }[];
  types?: {                                       // Tipos do Pokémon
    type: { name: string }
  }[];
}
```

**Origem**: Dados brutos obtidos da PokeAPI

---

### 2. **Combatant** (Pokémon Pronto para Combate)
```typescript
interface Combatant {
  id: number;
  name: string;
  sprite: string;                    // URL da sprite
  level: number;                     // Nível (1-100)
  iv: number;                        // Individual Values (31 é máximo)
  
  // Stats Calculados
  hpMax: number;                     // HP máximo
  hp: number;                        // HP atual
  atk: number;                       // Ataque
  def: number;                       // Defesa
  spd: number;                       // Velocidade
  
  // Movimentos e Tipos
  moves: {
    name: string;
    power?: number | null;           // Potência do movimento (null = desconhecido)
    type?: string | null;            // Tipo do movimento
    url?: string;                    // URL da API para buscar detalhes
  }[];
  
  types?: string[];                  // Tipos do Pokémon (ex: ["fire", "flying"])
  
  // Metadata
  isBoss?: boolean;                  // Se é o boss da raid
  raw?: RawPokemon;                  // Referência aos dados brutos
  hasAttackedThisRound?: boolean;   // Controle de turnos
}
```

**Transformação**: `RawPokemon` → `Combatant` via `buildCombatant()` ou `buildCombatantAsync()`

---

### 3. **Move** (Movimento/Ataque)
```typescript
interface Move {
  name: string;
  url: string;
}
```

**Dados Enriquecidos** (após `fetchMoveDetails()`):
```typescript
{
  name: string;
  power: number | null;              // Potência (ex: 75, null = "Tackle" é 50)
  type: string | null;               // Tipo (ex: "fire", "water")
  accuracy: number | null;           // Acurácia em %
}
```

---

### 4. **RaidState** (Estado da Batalha)
```typescript
type RaidState = {
  boss: Combatant;                   // Boss randomizado
  team: Combatant[];                 // Equipe do jogador (máx 5)
  log: string[];                     // Log de ações (últimas 200)
  round: number;                     // Rodada atual
  finished: boolean;                 // Batalha terminou?
  winner?: "player" | "boss";        // Quem venceu
};
```

---

## Cálculos Principais

### 1. **Cálculo de Stats** (Fórmula Pokémon Gen V)

#### HP
```
HP = floor(((2 * base + IV + floor(EV/4)) * level) / 100) + level + 10
```

#### Outros Stats (Attack, Defense, Speed)
```
Stat = floor(((2 * base + IV + floor(EV/4)) * level) / 100) + 5
```

**Parâmetros**:
- `base`: Stats base do Pokémon (obtido da PokeAPI)
- `IV`: Individual Values (sempre 31 no projeto = máximo)
- `EV`: Effort Values (sempre 0 no projeto)
- `level`: Nível do Pokémon

**Exemplo**:
```javascript
// Pikachu nível 50, base HP 35
HP = floor(((2 * 35 + 31 + 0) * 50) / 100) + 50 + 10 = 101
```

---

### 2. **Cálculo de Dano**

#### Fórmula Base
```
BaseDamage = floor((((2 * level / 5 + 2) * power * atk) / def) / 50) + 2
```

#### Com Modificadores (Type Effectiveness e STAB)
```
FinalDamage = max(1, floor(BaseDamage * random * STAB * TypeMultiplier))
```

**Variáveis**:
- `level`: Nível do atacante
- `power`: Potência do movimento (ex: 75, padrão 50)
- `atk`: Ataque do atacante
- `def`: Defesa do defensor
- `random`: Valor entre 0.85 e 1.0 (variação natural)
- `STAB`: 1.5 se tipo do movimento = tipo do Pokémon, senão 1.0
- `TypeMultiplier`: Efetividade do tipo (0.5, 1.0, 2.0, etc)

**Exemplo**:
```javascript
// Charizard (ATK 84) nível 50 usa Flamethrower (power 90) contra Venusaur (DEF 65)
BaseDamage = floor((((2 * 50 / 5 + 2) * 90 * 84) / 65) / 50) + 2 ≈ 48
// Se for STAB (fire type): x1.5
// Se for super efetivo (fire vs grass): x2.0
FinalDamage ≈ 48 * 0.92 * 1.5 * 2.0 ≈ 132
```

---

### 3. **Type Effectiveness (Efetividade de Tipos)**

Implementado em `typeChart.ts` como uma lookup table:

```typescript
TYPE_CHART: {
  fire: { grass: 2, bug: 2, steel: 2, water: 0.5, ... },
  water: { fire: 2, ground: 2, rock: 2, grass: 0.5, ... },
  // ... todos os 18 tipos
}
```

**Valores**:
- `2.0`: Super efetivo (causa 2x dano)
- `1.0`: Normal (não tem vantagem/desvantagem)
- `0.5`: Não muito efetivo (causa 0.5x dano)
- `0`: Sem efeito (Pokémon não sofre dano)

**Cálculo**:
```typescript
const multiplier = getTypeEffectiveness(moveType, defenderTypes);
// Verifica cada tipo do defensor e aplica o multiplicador maior
```

---

## Fluxo da Aplicação

### 1. **Tela Inicial** (`page.tsx`)

```
┌─────────────────────────────────┐
│   RAID — DESAFIO               │
├─────────────────────────────────┤
│                                 │
│   ┌───────────────────────────┐ │
│   │   [Sprite do Boss]        │ │
│   │   Boss Name               │ │
│   │   Nível 100 · IV 31       │ │
│   │   [Desafiar]              │ │
│   └───────────────────────────┘ │
│                                 │
│   ┌───────────────────────────┐ │
│   │ 8 Candidatos Randomizados │ │
│   │ [Card] [Card] [Card] ...  │ │
│   │ Selecione 5 Pokémon       │ │
│   │ [Iniciar Raid]            │ │
│   └───────────────────────────┘ │
└─────────────────────────────────┘
```

**Fluxo**:
1. Ao carregar: `generateBossRaw()` cria um boss aleatório (nível 100, IV 31)
2. Botão "Desafiar": `generateCandidatesRaw()` cria 8 candidatos com níveis aleatórios (1-70)
3. Usuário seleciona 5 Pokémon (máximo)
4. Clica "Iniciar Raid": Armazena dados em `sessionStorage` e navega para `/raid/battle`

---

### 2. **Tela de Batalha** (`raid/battle/page.tsx`)

```
┌──────────────────────────────────────────┐
│         BATALHA CONTRA O BOSS             │
├──────────────────────────────────────────┤
│  [Boss Sprite]  vs  [Equipe do Jogador] │
│  Boss Name                               │
│  HP: [████████░░] 250/300               │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ Selecione Pokémon e Movimento     │ │
│  │ [Pikachu] [Charizard] [Venusaur] │ │
│  │ [Ataque 1] [Ataque 2] [Ataque 3] │ │
│  │ [Ataque]                          │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ LOG DE BATALHA                    │ │
│  │ Pikachu usou Thunderbolt e caus... │ │
│  │ Boss usou Dragon Rage e causou ... │ │
│  │ Charizard recebeu dano crítico... │ │
│  └────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

**Fluxo de Batalha**:
1. Carrega dados do `sessionStorage`
2. Converte em `Combatant` com `buildCombatantAsync()`
3. Jogador seleciona Pokémon e movimento
4. Sistema calcula dano e atualiza HP
5. Boss escolhe alvo aleatório e ataca
6. Loop até alguém vencer

---

## Funções Principais

### `pokemonUtils.ts`

#### `getBaseStat(raw: RawPokemon, statName: string): number`
Extrai o valor base de um stat específico.
```typescript
const hpBase = getBaseStat(raw, "hp"); // 45
```

---

#### `calcHP(base, iv, ev, level): number`
Calcula HP máximo usando a fórmula Pokémon.

---

#### `calcStat(base, iv, ev, level): number`
Calcula outros stats (ATK, DEF, SPD).

---

#### `buildCombatant(raw, level, iv, isBoss): Combatant`
Transforma `RawPokemon` em `Combatant` (síncrono).
- Calcula todos os stats
- Extrai até 4 movimentos (sem detalhes)
- Usa fallbacks (Tackle) se necessário

```typescript
const combatant = buildCombatant(raw, 50);
// {
//   name: "Pikachu",
//   level: 50,
//   hp: 95,
//   atk: 62,
//   def: 48,
//   spd: 80,
//   moves: [{ name: "Thunderbolt", ... }, ...]
// }
```

---

#### `buildCombatantAsync(raw, level, iv, isBoss): Promise<Combatant>`
Como `buildCombatant`, mas busca detalhes dos movimentos na PokeAPI em paralelo.
- Muito mais lento mas com dados completos (power, type, accuracy)

---

#### `fetchMoveDetails(url): Promise<MoveDetails | null>`
Busca detalhes de um movimento na PokeAPI.
```typescript
const details = await fetchMoveDetails("https://pokeapi.co/api/v2/move/25/");
// { name: "Thunderbolt", power: 90, type: "electric", accuracy: 100 }
```

---

#### `fetchMovePower(moveUrl): Promise<number | null>`
Busca apenas a potência de um movimento.

---

#### `calcDamage(attacker, defender, power): number`
Calcula dano **sem** considerar tipos.

---

#### `calcDamageWithType(attacker, defender, move): DamageResult`
Calcula dano **com** STAB e type effectiveness.

```typescript
const result = calcDamageWithType(pikachu, gyarados, thunderboltMove);
// {
//   damage: 152,
//   modifier: 1.72,       // random * STAB * typeMultiplier
//   typeMultiplier: 2.0,  // super efetivo
//   stab: 1.0,            // não é STAB (pikachu é electric, thunderbolt é electric)
//   rand: 0.86            // variação natural
// }
```

---

### `raidGenerator.ts`

#### `generateBossRaw(): Promise<RawPokemon>`
Seleciona um Pokémon aleatório (1-898) e busca da PokeAPI.
```typescript
const boss = await generateBossRaw();
// Boss com nível fixo 100
```

---

#### `generateCandidatesRaw(count, maxLevel): Promise<Candidate[]>`
Gera `count` Pokémon com níveis aleatórios.
```typescript
const candidates = await generateCandidatesRaw(8, 70);
// [
//   { raw: { id: 25, name: "pikachu", ... }, level: 42 },
//   { raw: { id: 6, name: "charizard", ... }, level: 67 },
//   ...
// ]
```

---

#### `buildBossCombatant(raw): Combatant`
Helper: Cria combatant boss com nível 100.

---

#### `buildBossCombatantAsync(raw): Promise<Combatant>`
Helper: Cria combatant boss com movimentos enriquecidos.

---

### `typeChart.ts`

#### `getTypeEffectiveness(attackType: string, defenderTypes: string[]): number`
Calcula multiplicador baseado em tipos.

```typescript
// Fire vs Grass + Bug
getTypeEffectiveness("fire", ["grass", "bug"]);
// Retorna o máximo: 2.0 (super efetivo contra ambos)
```

---

## 🎯 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────┐
│ 1. PokeAPI Request (número aleatório)                  │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 2. RawPokemon (dados brutos da API)                    │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 3. buildCombatant[Async] (cálculos de stats)           │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Combatant (pronto para batalha)                     │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Batalha (calcDamageWithType, updates de HP)         │
└──────────────────────────────────────────────────────────┘
```

---

## Ciclo de Cada Rodada da Batalha

1. **Recolher Input**
   - Jogador seleciona: Pokémon + Movimento

2. **Validação**
   - Pokémon está vivo?
   - Já atacou esta rodada?
   - Movimento existe?

3. **Cálculo de Dano**
   ```
   Dano = calcDamageWithType(atacante, defensor, movimento)
   ```

4. **Aplicar Dano**
   ```
   boss.hp = max(0, boss.hp - dano)
   ```

5. **Registrar Log**
   ```
   "Pikachu usou Thunderbolt e causou 87 de dano. (x2.0, STAB)"
   ```

6. **Contra-Ataque do Boss**
   - Escolhe alvo aleatório vivo
   - Calcula dano similarmente
   - Aplica dano ao alvo

7. **Verificação de Vitória**
   - Boss morreu? → Vitória do jogador
   - Toda equipe morreu? → Vitória do boss
   - Senão, aguarda próximo turno

---

## Tecnologias e Padrões

### React Hooks Utilizados
- **useState**: Gerenciar estado de battle, log, seleções
- **useEffect**: Carregar dados do sessionStorage, inicializar batalla
- **useRouter**: Navegação entre páginas

### Next.js Features
- **App Router**: `/` página inicial, `/raid/battle` batalha
- **Client Components**: Componentes interativos marcados com `"use client"`
- **Image Optimization**: Componente `<Image>` do Next.js

### TypeScript
- Interfaces para tipagem forte
- Generics para componentes reutilizáveis

### Tailwind CSS
- Classes utilitárias para styling responsivo
- Tema escuro (gray-900, slate-100)
- Animações e estados (hover, disabled)

---

## Melhorias Futuras Possíveis

1. **Sistema de Abilities** (habilidades especiais do Pokémon)
2. **Itens de Consumo** (Poções, Revitalizar)
3. **Estratégia de IA** para o boss (não escolher alvo aleatoriamente)
4. **Persistência de Dados** (banco de dados para rankings)
5. **Animações de Batalha** (Framer Motion)
6. **Suporte a Múltiplas Línguas** (i18n)
7. **Status de Batalha** (envenenamento, paralisia, etc)
8. **Movimentos com Efeito Secundário** (crítico, efeito especial)

---

## Observações Técnicas

### Porquê `buildCombatantAsync`?
- Necessário buscar detalhes dos movimentos na PokeAPI
- Cada requisição leva ~200-500ms
- 4 movimentos × 8 candidatos = 32 requisições em paralelo

### SessionStorage vs LocalStorage?
- `sessionStorage` é temporário (limpo ao fechar aba)
- Apropriado para dados de uma sessão de raid
- Evita dados obsoletos após reload

### Fallback de Movimentos
- Se um Pokémon não tem movimentos na PokeAPI, usa "Tackle" (50 power)
- Garante que o combate sempre funciona

### Type Chart Incompleto?
- Implementa os 18 tipos principais
- Alguns matchups secundários podem estar ausentes
- Verificar `typeChart.ts` para lista completa

---

## Referências

- **PokeAPI Docs**: https://pokeapi.co/docs/v2
- **Pokémon Damage Calculator**: https://pokemonshowdown.com/calc/
- **Fórmulas Pokémon**: https://bulbapedia.bulbagarden.net/wiki/Damage
- **Next.js Docs**: https://nextjs.org/docs
- **TypeScript Docs**: https://www.typescriptlang.org/docs/

---

**Última Atualização**: 20/01/2025
**Versão do Projeto**: 0.1.0
