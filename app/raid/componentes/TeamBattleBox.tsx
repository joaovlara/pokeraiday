import PokemonStats from './PokemonStats'
import PokemonMenuLateral from './PokemonMenuLateral'
import LogCombat from './LogCombat'

const TeamBattleBox = () => {
  return (
    <section className='flex flex-row w-full'>
      <PokemonStats />
      <PokemonMenuLateral />
    </section>
  )
}

export default TeamBattleBox
