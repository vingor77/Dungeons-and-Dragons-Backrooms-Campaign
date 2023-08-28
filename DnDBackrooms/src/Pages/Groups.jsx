import React, { useEffect, useState } from 'react';
import db from '../Components/firebase';
import { Button, Container, Divider, Typography } from '@mui/material';
import { collection, onSnapshot } from 'firebase/firestore';
import BackroomsGroup from '../Components/BackroomsGroup';

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [currGroup, setCurrGroup] = useState(null);

  useEffect(() => {
    const collectionRef = collection(db, 'groups');

    const groupUnsub = onSnapshot(collectionRef, (querySnapshot) => {
      const objects = [];
      querySnapshot.forEach((doc) => {
        objects.push(doc.data());
      })
      setGroups(objects);
    })

    return () => {
      groupUnsub();
    }
  }, [])

  return (
    <Container>
      {groups.map((group, index) => {
        return (
          <Button onClick={() => setCurrGroup(group)} key={index} variant='outlined'>{group.name}</Button>
        )
      })}
      <BackroomsGroup currGroup={currGroup}/>
    </Container>
  )
}
