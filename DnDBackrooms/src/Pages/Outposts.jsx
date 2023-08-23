import { Container, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import db from '../Components/firebase'
import BackroomsOutposts from '../Components/BackroomsOutposts';

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
      <BackroomsOutposts outposts={outposts}/>
    </Container>
  )
}
