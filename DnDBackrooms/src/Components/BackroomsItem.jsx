import React from 'react'
import elixir from '../Images/strengthElixir0.png';
import candy from '../Images/candy5.png';
//import cube from '../Images/cube23.png';
import umi from '../Images/umi27.png';
import darkRep from '../Images/darkRep35.png';
import backROM from '../Images/backROM47.png';
import sack from '../Images/sack87.png';
import blanche from '../Images/blanche96.png';
import dice from '../Images/dice666.png';


export default function BackroomsItem(props) {
  const SpecialItem = () => {
    switch(props.itemNum) {
      case 0:
        return <img src={elixir}></img>
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
      /*
      case 43:
        return <img src={tarot}></img>
      */
      case 47:
        return <img src={backROM}></img>
      case 87:
        return <img src={sack}></img>
      case 96:
        return <img src={blanche}></img>
      case 666:
        console.log("666");
        return <img src={dice}></img>
      default:
        console.log("return");
        return
    }
  }

  return (
    <div>
      <p>Name: {props.name}</p>
      <p>Item #: {props.itemNum}</p>
      <p>Rarity: {props.rarity}</p>
      <p>Locations:</p>
      <ul>
        {props.locations.map(element => {
          return (
            <li>{element}</li>
          );
        })}
      </ul>
      {props.artifactPrice === -1 ? "": <p>Artifact price: {props.artifactPrice}</p>}

      <p>Description: {props.description}</p>
      {props.table ? <SpecialItem />: ""}
      {/*If item 5, 23, 27, 35, 47, 87, 96, 666 */}

    </div>
  )
}