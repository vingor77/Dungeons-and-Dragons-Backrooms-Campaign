import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import BackroomsQuests from './BackroomsQuests';
import db from '../Components/firebase';

export default function BackroomsOutposts(props) {
  const [showShops, setShowShops] = useState(false);
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    const collectionRef = collection(db, 'quests');
    const q = query(collectionRef, where('outpost', '==', props.outpost.name));

    const unsub = onSnapshot(q, (querySnapshot) => {
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
    <>
      <div>
        <Typography variant='h2'>{props.outpost.name}</Typography>
        <Typography variant='h5'>Description:</Typography>
        <Typography variant='body1' sx={{textIndent: 25}}>{props.outpost.description}</Typography>
        <Typography variant='h5'>Notable people:</Typography>
        <ul>
          {props.outpost.notablePeople.map((person, index) => {
            return <li key={index}>{person}</li>
          })}
        </ul>
        <br />
        {quests.length > 0 ?
          <>
            <Typography variant='h5'>Quests:</Typography>
            <BackroomsQuests quests={quests}/>
            <br />
          </>
        :
          ""
        }
        {props.outpost.map !== undefined ?
          <>
            <Typography variant='h5'>Map:</Typography>
            <img src={props.outpost.map} style={{width: '100%'}} />
            <br />
          </>
        :
          ""
        }
        {props.outpost.hasShops ?
        <>
          <Button onClick={() => setShowShops(!showShops)}>Show/Hide shops</Button>
          {showShops ? 
          <>
            {props.outpost.shops.map((mapContent, index) => {
              const pairs = JSON.parse(mapContent);
              return (
                <>
                  <Typography variant='h5'>{props.outpost.shopNames[index]}</Typography>
                  <Table sx={{maxWidth: '50%'}}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{width: '90%'}}>Name</TableCell>
                        <TableCell sx={{textAlign: 'center'}}>Quantity</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pairs.map((pair, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell>{pair[0]}</TableCell>
                            <TableCell sx={{textAlign: 'center'}}>{pair[1]}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                  <br />
                </>
              )
            })}
          </> 
          :""
        }
        </> 
        :""
        }
      </div>
    </>
  )
}
