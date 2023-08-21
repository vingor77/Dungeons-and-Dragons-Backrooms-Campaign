import { Card, CardContent, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { storage } from '../Components/firebase';
import { getDownloadURL, listAll, ref } from 'firebase/storage';


export default function BackroomsEntities(props) {
  const storageRef = ref(storage, 'stats/');
  const [entityUrl, setEntityUrl] = useState({});
  const [currEntity, setCurrEntity] = useState(0);

  useEffect(() => {
    listAll(storageRef).then((response) => {
      response.items.forEach((item) => {
        if(Number(item._location.path.substring(13).split(".")[0]) === props.entityNum) {
          getDownloadURL(item).then((url) => {
            setCurrEntity(Number(item._location.path.substring(13).split(".")[0]));
            setEntityUrl(url);
          })
        }
      })
    })
  }, [])

  return (
    <Card>
        <CardContent>
          <Typography variant='h2'>{props.name}</Typography>
          <Typography variant='h5'>Spawn locations:</Typography>
          <ul>
            {props.locations.map((element, index) => {
              return (
                <li key={index}>{element}</li>
              );
            })}
          </ul>
          <Typography variant='h5'>Description:</Typography>
          <Typography variant='body1' sx={{textIndent: 25}}>{props.description}</Typography>
          {props.challengeRating !== 0 ? 
            props.entityNum === currEntity ? <img src={entityUrl}></img>:
            "":
            <Typography variant='body1'>No stat block available</Typography>
          }
        </CardContent>
    </Card>
  )
}
