import React from 'react'

export default function Navbar() {
  return (
    <nav className='navbar'>
        <h1>Test</h1>
        <div className='links'>
            <a href='/'>Groups</a>
            <a href='/levels'>Levels</a>
            <a href='/items'>Items</a>
            <a href='/quests'>Quests</a>
            <a href='/info'>General Information</a>
        </div>
    </nav>
  )
}
