import React from 'react'
import elixir from '../assets/strengthElixir0.png';
import candy from '../assets/candy5.png';
//import cube from '../assets/cube23.png';
import umi from '../assets/umi27.png';
import darkRep from '../assets/darkRep35.png';
import backROM from '../assets/backROM47.png';
import sack from '../assets/sack87.png';
import blanche from '../assets/blanche96.png';
import dice from '../assets/dice666.png';


export default function BackroomsItem(props) {
  const SpecialItem = () => {
    switch(props.itemNum) {
      case 0:
        return <img src={elixir}></img>
      case 5:
        return <img src={candy}></img>
      /*
      case 23:
        <img src={candy}></img>
      */
      case 27:
        return <img src={umi}></img>
      case 35:
        return <img src={darkRep}></img>
      case 47:
        return <img src={backROM}></img>
      case 87:
        return <img src={sack}></img>
      case 96:
        return <img src={blanche}></img>
      case 666:
        return <img src={dice}></img>
    }
  }

  return (
    <div>
      <p>Name: {props.name}</p>
      <p>Item #: {props.itemNum}</p>
      <p>Rarity: {props.rarity}</p>
      <p>
        Locations:
        <br />
        <ul>
          {props.locations.map(element => {
            return (
              <li>{element}</li>
            );
          })}
        </ul>
      </p>
      {props.artifactPrice === -1 ? "": <p>Artifact price: {props.artifactPrice}</p>}

      {props.table ?
        <>
          <p>Description: {props.description}</p>
          <SpecialItem />
          {/*If item 5, 23, 27, 35, 47, 87, 96, 666 */}
        </>
      :
        <p>Description: {props.description}</p>
      }

    </div>
  )
}