import { Container, Typography } from '@mui/material'
import React from 'react'

export default function Home() {
  return (
    <Container>
      <Typography variant='h1'>Welcome!</Typography>
      <Typography variant='body1'>
        This is an application I have created to specifically run my Dungeons and Dragons Backrooms game. It is an open-world game so everything needs to be ready ahead of time.
        This application allows me to do that, utilizing firebase. There is no logins or requirements to use it. If you are a player, you can look in the general and player informations.
        If you are a DM, you can look at everything.
      </Typography>
    </Container>
  )
}