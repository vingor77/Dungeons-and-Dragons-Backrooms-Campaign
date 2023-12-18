import { Box, Container, Typography } from '@mui/material'
import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import db from '../Components/firebase';
import BackroomsQuests from '../Components/BackroomsQuests';

export default function Quests() {
  const [quests, setQuests] = useState([]);
  const [unlock, setUnlock] = useState([]);

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

  useEffect(() => {
    let unlockQuests = [];
    for(let i = 0; i < quests.length; i++) {
      if(quests[i].unlocked) unlockQuests.push(quests[i]);
    }
    setUnlock(unlockQuests);
  }, [quests])

  return (
    <Box paddingLeft={5} paddingRight={5} paddingTop={2}>
      <BackroomsQuests quests={unlock} />
    </Box>
  )
}
