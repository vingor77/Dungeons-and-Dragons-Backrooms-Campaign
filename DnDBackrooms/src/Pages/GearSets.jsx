import { Container, Typography } from '@mui/material';
import { collection, onSnapshot } from 'firebase/firestore';
import React, { useState } from 'react';
import db from '../Components/firebase';

export default function GearSets() {
  const [gearSets, setGearSets] = useState(null);

  const getSets = () => {
    const collectionRef = collection(db, 'gearSets');
  
    const unsub = onSnapshot(collectionRef, (querySnapshot) => {
      let stuff = [];
      querySnapshot.forEach((doc) => {
        stuff.push(doc.data());
      })
      setGearSets(stuff);
    })

    return () => unsub();
  }

  const showSetBonuses = (bonus) => {
    let revealedBonuses = [];
    for(let i = 0; i < bonus; i++) {
      revealedBonuses.push(bonus[i]);
    }

    return (
      <ul>
        {revealedBonuses.map((b, index) => {
          return <li key={index}>{b}</li>
        })}
      </ul>
    )
  }

  return (
    <Container>
        {gearSets === null ? 
          getSets() 
          :
          <>
            {gearSets.map((set, index) => {
              return (
                <div key={index}>
                  <Typography variant='h2'>{set.setName}</Typography>
                  <Typography variant='h5'>Gear in the set:</Typography>
                  <ul>
                    {set.gear.map((g, index) => {
                      return <li key={index}>{g}</li>
                    })}
                  </ul>
                  {set.revealed === 0 ? 
                    <>
                      <Typography variant='h5'>Bonuses for the set:</Typography>
                      <br />
                      <Typography variant='body1'>Set not revealed yet. Find enough items to reveal it</Typography>
                    </>
                    :
                    <>
                      <Typography variant='h5'>Bonuses for the set:</Typography>
                      {showSetBonuses(set.bonus)}
                    </>
                  }
                  {}
                </div>
              )
            })}
          </>
        }
    </Container>
  )
}
