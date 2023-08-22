import React from 'react'
import { AppBar, Stack, Toolbar, Link, Container } from '@mui/material';

export default function Navbar() {
  return (
    <Container>
      <AppBar position='sticky'>
        <Toolbar>
          <Stack direction='row' spacing={2}>
            <Link href='/' color='inherit' underline='none'>Home</Link>
            <Link href='/groups' color='inherit' underline='none'>Groups</Link>
            <Link href='/outposts' color='inherit' underline='none'>Outposts</Link>
            <Link href='/quests' color='inherit' underline='none'>Quests</Link>
            <Link href='/items' color='inherit' underline='none'>Items</Link>
            <Link href='/entities' color='inherit' underline='none'>Entities</Link>
            <Link href='/levels' color='inherit' underline='none'>Levels</Link>
            <Link href='/info' color='inherit' underline='none'>Player Info</Link>
          </Stack>
        </Toolbar>
      </AppBar>
    </Container>
  )
}