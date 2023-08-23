import React, { useEffect, useState } from 'react';
import db from '../Components/firebase';
import { Button, Container, Divider, Typography } from '@mui/material';
import { collection, onSnapshot } from 'firebase/firestore';
import BackroomsGroup from '../Components/BackroomsGroup';
import BackroomsOutposts from '../Components/BackroomsOutposts';

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [outposts, setOutposts] = useState([]);
  const [quests, setQuests] = useState([]);

  const [currGroup, setCurrGroup] = useState(null);
  const [filteredOutposts, setFilteredOutposts] = useState([]);
  const [filteredQuests, setFilteredQuests] = useState([]);

  //Getting the data
  useEffect(() => {
    const collectionRef = collection(db, 'groups');
    const outpostRef = collection(db, 'outposts');
    const questRef = collection(db, 'quests');

    const groupUnsub = onSnapshot(collectionRef, (querySnapshot) => {
      const objects = [];
      querySnapshot.forEach((doc) => {
        objects.push(doc.data());
      })
      setGroups(objects);
    })

    const outpostUnsub = onSnapshot(outpostRef, (querySnapshot) => {
      const objects = [];
      querySnapshot.forEach((doc) => {
        objects.push(doc.data());
      })
      setOutposts(objects);
    })

    const questUnsub = onSnapshot(questRef, (querySnapshot) => {
      const objects = [];
      querySnapshot.forEach((doc) => {
        objects.push(doc.data());
      })
      setQuests(objects);
    })

    return () => {
      groupUnsub();
      outpostUnsub();
      questUnsub();
    }
  }, [])

  //Finding outpost for the group
  useEffect(() => {
    if(currGroup === null) return;

    let group = {};
    for(let i = 0; i < groups.length; i++) {
      if(groups[i].name === currGroup.name) {
        group = groups[i];
        break;
      }
    }

    let filter = [];

    for(let i = 0; i < outposts.length; i++) {
      if(outposts[i].group === group.name) {
        filter.push(outposts[i]);
      }
    }
    setFilteredOutposts(filter);
  }, [currGroup])

  //Finding quests for the outpost
  useEffect(() => {
    let group = {};
    for(let i = 0; i < groups.length; i++) {
      if(groups[i].name === currGroup.name) {
        group = groups[i];
        break;
      }
    }

    let filter = [];

    for(let i = 0; i < quests.length; i++) {
      for(let j = 0; j < filteredOutposts.length; j++) {
        if(quests[i].outpost === filteredOutposts[j].name && filteredOutposts[j].group === group.name && quests[i].unlocked) {
          filter.push(quests[i]);
        }
      }
    }
    
    setFilteredQuests(filter);

  }, [filteredOutposts])

  //TODO: Figure out how to render out outposts and quests, if even at all.
  return (
    <Container>
      {groups.map((group, index) => {
        return (
          <Button onClick={() => setCurrGroup(group)} key={index} variant='outlined'>{group.name}</Button>
        )
      })}
      <BackroomsGroup currGroup={currGroup}/>
      <br />
      <Divider />
      <br />
      <BackroomsOutposts outposts={filteredOutposts}/>
      {/*Outposts and quests go here. Outpost will be a data grid where onRowClick display description, notable people, and shops(if needed). Quests may just stay on its own or it will be displayed underneath the shops. Idk about that yet.*/}
    </Container>
  )
}
