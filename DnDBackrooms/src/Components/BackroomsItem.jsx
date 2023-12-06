import React from 'react'
import elixir from '../Images/strengthElixir0.png';
import candy from '../Images/candy5.png';
import cube from '../Images/cube23.png';
import umi from '../Images/umi27.png';
import darkRep from '../Images/darkRep35.png';
import tarot1 from '../Images/tarot43_1.png';
import tarot2 from '../Images/tarot43_2.png';
import backROM from '../Images/backROM47.png';
import sack from '../Images/sack87.png';
import blanche from '../Images/blanche96.png';
import dice from '../Images/dice666.png';
import portableGod from '../Images/portableGod.png';
import { Card, CardContent, Typography } from '@mui/material';


export default function BackroomsItem(props) {
  const SpecialItem = () => {
    switch(props.itemNum) {
      case 0:
        if(props.name === "Strength Elixir(Level Items)") {
          return <img src={elixir}></img>
        }
        else if(props.name === "Portable God") {
          return <img src={portableGod}></img>
        }
        else {
          return
        }
      case 5:
        return <img src={candy}></img>
      case 23:
        return <img src={cube}></img>
      case 27:
        return <img src={umi}></img>
      case 35:
        return <img src={darkRep}></img>
      case 43:
        return (
          <>
            <img src={tarot1}></img>
            <img src={tarot2}></img>
          </>
        )
      case 47:
        return <img src={backROM}></img>
      case 87:
        return <img src={sack}></img>
      case 96:
        return <img src={blanche}></img>
      case 666:
        return <img src={dice}></img>
      default:
        return
    }
  }

  return (
    props.display === 'level' ?
      <Card>
        <CardContent>
          <Typography variant='h5'><b>{props.name}</b>: <Typography variant='body1' display='inline'>{props.description}</Typography></Typography>
          <br />
          <SpecialItem />
        </CardContent>
      </Card>
    :
      <Card>
        <CardContent>
          <Typography variant='h5'><b>{props.name}</b>: <Typography variant='body1' display='inline'>{props.description}</Typography></Typography>
          <br />
          <SpecialItem />
        </CardContent>
      </Card>
  )
}