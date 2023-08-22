import { Container, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import db from '../Components/firebase'

export default function Outposts() {
  const [outposts, setOutposts] = useState([]);

  const collectionRef = collection(db, 'outposts');
  useEffect(() => {
    const unsub = onSnapshot(collectionRef, (querySnapshot) => {
      const objects = [];
      querySnapshot.forEach((doc) => {
        objects.push(doc.data());
      })
      setOutposts(objects);
    })

    return () => {
      unsub();
    }
  }, []);

  return (
    <Container>
      {outposts.map((outpost, index) => {
        return (
          <div key={index}>
            <Typography variant='h2'>{outpost.name}</Typography>
            <Typography variant='h5'>Location:</Typography>
            <Typography variant='body1'>Level {outpost.location}</Typography>
        
            <Typography variant='h5'>Group:</Typography>
            <Typography variant='body1'>{outpost.group}</Typography>
        
            <Typography variant='h5'>Description:</Typography>
            <Typography variant='body1'>{outpost.description}</Typography>
        
            <Typography variant='h5'>Notable people:</Typography>
            <ul>
              {outpost.notablePeople.map((person, index) => {
                return <li key={index}>{person}</li>
              })}
            </ul>
            
            <Typography variant='h5'>hasShops:</Typography>
            {outpost.hasShops ? <Typography variant='body1'>True</Typography>:  <Typography variant='body1'>False</Typography>}
          </div>
        )
      })}
    </Container>
  )
}
