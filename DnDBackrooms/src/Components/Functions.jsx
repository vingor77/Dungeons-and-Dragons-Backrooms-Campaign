import { collection, onSnapshot } from 'firebase/firestore'
import db from '../Components/firebase'
import React, { useEffect, useState } from 'react'
import { Button, Container, Divider, TextField, Typography } from '@mui/material';

export default function Functions() {
  const [uncoveredDocs, setUncoveredDocs] = useState([]);
  const [wifiStrength, setWifiStrength] = useState(0);
  const [roll, setRoll] = useState(1);
  const [availabeDocs, setAvailableDocs] = useState([]);
  const [shownFunction, setShownFunctions] = useState({});

  const collectionRef = collection(db, 'uncoveredDocs');

  useEffect(() => {
    const unsub = onSnapshot(collectionRef, (querySnapshot) => {
      const objects = [];
      querySnapshot.forEach((doc) => {
        objects.push(doc.data());
      })
      setUncoveredDocs(objects);
    })

    return () => {
      unsub();
    }
  }, [])

  const handleWifiStrength = (e) => {
    if(e.target.value > 100) {
      setWifiStrength(100);
    }
    else if(e.target.value < 0) {
      setWifiStrength(0);
    }
    else {
      setWifiStrength(Math.round(e.target.value));
    }
  }

  const handleRoll = (e) => {
    if(e.target.value > 100) {
      setRoll(100);
    }
    else if(e.target.value < 0) {
      setRoll(0);
    }
    else {
      setRoll(Math.round(e.target.value));
    }
  }

  const getPages = () => {
    if(wifiStrength === 0) {
      setAvailableDocs([]);
      return;
    }

    const pagePercentage = roll * (wifiStrength / 100);

    let pages = [];
    setUncoveredDocs(uncoveredDocs.sort((a, b) => Math.random() - 0.5));

    let pageAmount = Math.round(pagePercentage * uncoveredDocs.length) / 100;
    if(pageAmount < 1) {
      pageAmount = 1;
    }

    for(var i = 0; i < pageAmount; i++) {
      pages.push(uncoveredDocs[i]);
    }

    setAvailableDocs(pages);
  }

  return (
    <Container>
      <Button variant='outlined' onClick={() => setShownFunctions("wifiDocGen")}>Wi-Fi document generator</Button>
      <Button variant='outlined' onClick={() => setShownFunctions("test")}>Test</Button>
      {shownFunction === 'wifiDocGen' ? 
        <>
          <div className='wifiDocGen'>
            <br />
            <Divider />
            <br />
            <Typography variant='h5'>Uncovered document generator:</Typography>
            <br />
            <TextField
              value={wifiStrength}
              type='number'
              min='0'
              max='100'
              size='small'
              required
              id="outlined-required"
              label="Wi-Fi strength"
              onChange={e => handleWifiStrength(e)}
            />
            <TextField
              value={roll}
              type='number'
              min='1'
              max='100'
              size='small'
              required
              id="outlined-required"
              label="Roll"
              onChange={e => handleRoll(e)}
            />
            <Button onClick={getPages} variant='outlined' size='large'>Generate documents</Button>
            {availabeDocs.length === 0 ? <Typography variant='body1'>Wi-Fi has a strength of 0 and does not work.</Typography>:
              <>
                <Typography variant='h5'>Available documents:</Typography>
                <ul>
                  {availabeDocs.map(item => {
                    return <li>{item.pageName}</li>
                  })}
                </ul>
              </>
            }
          </div>
        </>
      : 
      ""}
      {shownFunction === 'test' ? "Test": ""}
    </Container>
  )
}
