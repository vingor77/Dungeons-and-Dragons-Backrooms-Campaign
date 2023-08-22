import { Container, Typography } from '@mui/material'
import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import db from '../Components/firebase';

export default function Quests() {
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    const collectionRef = collection(db, 'quests');

    const unsub = onSnapshot(collectionRef, (querySnapshot) => {
      const objects = [];
      querySnapshot.forEach((doc) => {
        objects.push(doc.data());
      })
      setQuests(objects);
    })

    return () => {
      unsub();
    }
  }, [])

  return (
    <Container>
      {quests.map((quest, index) => {
        return (
          <div key={index}>
            <Typography variant='h2'>Description:</Typography>
            <Typography variant='body1'>{quest.description}</Typography>
            <Typography variant='h2'>Outpost:</Typography>
            <Typography variant='body1'>{quest.outpost}</Typography>
            <Typography variant='h2'>Quest giver:</Typography>
            <Typography variant='body1'>{quest.questGiver}</Typography>
            <Typography variant='h2'>Reward:</Typography>
            <Typography variant='body1'>{quest.reward}</Typography>
          </div>
        )
      })}
    </Container>
  )
}
