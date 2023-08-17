import React from 'react'
import elixir from '../Images/strengthElixir0.png';
import candy from '../Images/candy5.png';
//import cube from '../Images/cube23.png';
import umi from '../Images/umi27.png';
import darkRep from '../Images/darkRep35.png';
import tarot1 from '../Images/tarot43_1.png';
import tarot2 from '../Images/tarot43_2.png';
import backROM from '../Images/backROM47.png';
import sack from '../Images/sack87.png';
import blanche from '../Images/blanche96.png';
import dice from '../Images/dice666.png';
import { Card, CardContent, CardMedia, Stack, Typography } from '@mui/material';


export default function BackroomsItem(props) {
  const SpecialItem = () => {
    switch(props.itemNum) {
      case 0:
        return props.name === "Strength Elixir(Level Items)" ? <img src={elixir}></img>: ""
      case 5:
        return <img src={candy}></img>
      /*
      case 23:
        <img src={cube}></img>
      */
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
    <Card>
      <CardContent>
        <Typography variant='h4'>{props.name}</Typography>
        <Stack direction='row' spacing={2}>
          <Typography variant='h6'>Item#: {props.itemNum}</Typography>
          <Typography variant='h6'>Rarity: {props.rarity}</Typography>
          {props.artifactPrice === -1 ? "": <Typography variant='h6'>Price: {props.artifactPrice}</Typography>}
        </Stack>
        <Typography variant='h4'>Spawn locations:</Typography>
        <ul>
          {props.locations.map((element, index) => {
            return (
              <li key={index} disablePadding>{element}</li>
            );
          })}
        </ul>
        <Typography variant='body1'>Description: {props.description}</Typography>
        <SpecialItem style={{textAlign: 'center'}}/>  
      </CardContent>
    </Card>
  )

  /*
  return (
    <div>
      <p>Name: {props.name}</p>
      <p>Item #: {props.itemNum}</p>
      <p>Rarity: {props.rarity}</p>
      <p>Locations:</p>
      <ul>
        {props.locations.map((element, index) => {
          return (
            <li key={index}>{element}</li>
          );
        })}
      </ul>
      {props.artifactPrice === -1 ? "": <p>Artifact price: {props.artifactPrice}</p>}

      <p>Description: {props.description}</p>
      {props.table ? <SpecialItem />: ""}
    </div>
  )
*/
}