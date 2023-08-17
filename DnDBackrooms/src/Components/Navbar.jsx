import React from 'react'

export default function Navbar() {
  const linksStyle = {
    marginLeft: '10px'
  }

  return (
    <nav className='navbar'>
        <h1>Test</h1>
        <div className='links'>
          <a href='/'>Groups</a>
          <a href='/levels' style={linksStyle}>Levels</a>
          <a href='/items' style={linksStyle}>Items</a>
          <a href='/quests' style={linksStyle}>Quests</a>
          <a href='/info' style={linksStyle}>Player page</a>
        </div>
    </nav>
  )
}
