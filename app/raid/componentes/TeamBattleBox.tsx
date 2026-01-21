import React from 'react'
import PokemonStats from './PokemonStats'
import AtackBox from './AtackBox'
import PokemonMenuLateral from './PokemonMenuLateral'

const TeamBattleBox = () => {
  return (
    <section className='flex flex-row w-full'>
      <PokemonStats />
      <PokemonMenuLateral />
    </section>
  )
}

export default TeamBattleBox
