import React, { useEffect, useState } from 'react';
import db from '../Components/firebase';
import { Button, Container, Typography } from '@mui/material';
import { collection, onSnapshot } from 'firebase/firestore';

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
      if(groups[i].name === currGroup) {
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
      if(groups[i].name === currGroup) {
        group = groups[i];
        break;
      }
    }

    let filter = [];

    for(let i = 0; i < quests.length; i++) {
      for(let j = 0; j < filteredOutposts.length; j++) {
        if(quests[i].outpost === filteredOutposts[j].name && filteredOutposts[j].group === group.name) {
          filter.push(quests[i]);
        }
      }
    }
    
    setFilteredQuests(filter);

  }, [filteredOutposts])

  return (
    <Container>
      {groups.map((group, index) => {
        return (
          <Button onClick={() => setCurrGroup(group.name)} key={index} variant='outlined'>{group.name}</Button>
        )
      })}
      {filteredOutposts.length === 0 && currGroup !== null ? "No outposts":
        groups.map((group, index) => {
          if(group.name === currGroup) {
            return (
              <>
                <Typography variant='h2' key={index}>Group: {group.name}</Typography>
                {filteredOutposts.map((outpost, index) => {
                  return (
                    <>
                      <Typography variant='h4' key={index}>Outpost: {outpost.name}</Typography>
                      {filteredQuests.map((quest, index) => {
                        if(quest.unlocked) {
                          return <Typography variant='body1' key={index}>Quest: {quest.name} unlocked</Typography>
                        }
                        else {
                          return <Typography variant='body1' key={index}>Quest: {quest.name} stll locked</Typography>
                        }
                      })}
                    </>
                  )
                })}
              </>
            )
          }
        })
      }
    </Container>
  )
}
