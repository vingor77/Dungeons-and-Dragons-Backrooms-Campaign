import { addDoc, collection, deleteDoc, doc, onSnapshot, query, setDoc, where } from 'firebase/firestore'
import db from '../Components/firebase'
import React, { useState } from 'react'
import { Button, Container, Divider, Input, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';

export default function Functions() {
  //Uncovered docs
  const [uncoveredDocs, setUncoveredDocs] = useState(null);
  const [wifiStrength, setWifiStrength] = useState(0);
  const [roll, setRoll] = useState(1);
  const [availabeDocs, setAvailableDocs] = useState([]);

  const [shownFunction, setShownFunctions] = useState({});

  //Timers
  const [currTimer, setCurrTimer] = useState({
    name: "",
    time: ""
  });
  const [timers, setTimers] = useState({});
  const [logged, setLogged] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [timeReduction, setTimeReduction] = useState("");
  const [hours, setHours] = useState("");

  const getDocuments = () => {
    const collectionRef = collection(db, 'uncoveredDocs');

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
  }

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

  //Timer stuff
  const DisplayTimers = () => {
    const keys = Object.keys(timers);

    return (
      <>
        {keys.length > 0 ?
          <>
            <Typography variant='h5'>Current timers:</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timer name</TableCell>
                  <TableCell>Time left (in minutes)</TableCell>
                  <TableCell>Time left (in hours)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {keys.map((key, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{timers[key].name}</TableCell>
                      <TableCell>{timers[key].time}</TableCell>
                      <TableCell>{(timers[key].time / 60.0).toFixed(2)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </>
        :
          <Typography variant='body1'>No currently active timers</Typography>
        }
      </>
    )
  }

  const handleNameSubmission = () => {
    const timerRef = collection(db, 'timers');
    const q = query(timerRef, where("playerName", "==", playerName.toUpperCase()));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let temp = {};
      let count = 1;
      querySnapshot.forEach((doc) => {
        temp[count] = doc.data();
        count++;
      })
      setTimers(temp);
    })

    setLogged(true);

    return () => {
      unsub();
    }
  }

  const addTimer = () => {
    let temp = JSON.parse(JSON.stringify(timers));
    temp = Object.assign(temp, {[Object.keys(timers).length + 1]: currTimer});
    setTimers(temp);

    setDoc(doc(db, 'timers', (currTimer.name + playerName)), {
      name: currTimer.name,
      time: currTimer.time,
      playerName: playerName.toUpperCase(),
    });

    setCurrTimer({
      name: "",
      time: "",
    })
  }

  const removeTime = () => {
    for(let i = 0; i < Object.keys(timers).length; i++) {
      if(timers[Object.keys(timers)[i]].time - timeReduction <= 0) {
        deleteDoc(doc(db, 'timers', (timers[Object.keys(timers)[i]].name + playerName)));
        alert(timers[Object.keys(timers)[i]].name + " has hit 0.");
      }
      else {
        setDoc(doc(db, 'timers', (timers[Object.keys(timers)[i]].name + playerName)), {
          name: timers[Object.keys(timers)[i]].name,
          playerName: playerName.toUpperCase(),
          time: (timers[Object.keys(timers)[i]].time - timeReduction),
        });
      }
    }

    setTimeReduction("");
  }

  return (
    <Container>
      <Button variant='outlined' onClick={() => setShownFunctions("wifiDocGen")}>Wi-Fi document generator</Button>
      <Button variant='outlined' onClick={() => setShownFunctions("timers")}>Timers</Button>
      <Divider />
      {shownFunction === 'wifiDocGen' ? 
        <>
          {uncoveredDocs === null ? getDocuments() : 
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
                    {availabeDocs.map((item, index) => {
                      return <li key={index}>{item.pageName}</li>
                    })}
                  </ul>
                </>
              }
            </div>
          }
        </>
      : 
      ""}
      {shownFunction === 'timers' ?
        <>
          <Typography variant='h1'>Timers</Typography>
          {!logged ?
            <>
              <Stack border='1px solid black' padding={2} marginTop={2}>
                <Typography variant='h5'>Log in</Typography>
                <Divider />
                <br />
                <Stack direction='row' spacing={2}>
                  <Input type='text' value={playerName} onChange={e => setPlayerName(e.target.value)} placeholder='Enter username'></Input>
                  <Button variant='outlined' onClick={handleNameSubmission}>Submit name</Button>
                </Stack>
              </Stack>
            </>
            :
            <>
              <Stack border='1px solid black' padding={2}>
                <Typography variant='h5'>Log out</Typography>
                <Divider />
                <br />
                <Stack direction='row' spacing={2}>
                  <Button variant='outlined' onClick={() => {setLogged(false); setTimers({}); setPlayerName("")}}>Log out</Button>
                </Stack>
              </Stack>

              <br />
              <Stack border='1px solid black' padding={2}>
                <Typography variant='h5'>Convert from hours to minutes</Typography>
                <Divider />
                <br />
                <Stack direction='row' spacing={2}>
                  <Input type='number' value={hours} onChange={e => setHours(e.target.value)} placeholder='Enter time in hours'></Input>
                  <Button variant='outlined' onClick={() => {alert(hours * 60 + " minutes."); setHours("")}}>Convert</Button>
                </Stack>
              </Stack>

              <br />
              <Stack border='1px solid black' padding={2}>
                <Typography variant='h5'>Add a new timer</Typography>
                <Divider />
                <br />
                <Stack direction='row' spacing={2}>
                  <Input type='text' value={currTimer.name} onChange={e => setCurrTimer({...currTimer, name: e.target.value})} placeholder='Enter timer name'></Input>
                  <Input type='number' value={currTimer.time} onChange={e => setCurrTimer({...currTimer, time: e.target.value})} placeholder='Enter timer value'></Input>
                  <Button variant='outlined' onClick={addTimer}>Add</Button>
                </Stack>
              </Stack>

              <br />
              <Stack border='1px solid black' padding={2}>
                <Typography variant='h5'>Remove time from timers</Typography>
                <Divider />
                <br />
                <Stack direction='row' spacing={2}>
                  <Input type='number' value={timeReduction} onChange={(e) => setTimeReduction(e.target.value)} placeholder='Enter value'></Input>
                  <Button variant='outlined' onClick={removeTime}>Remove</Button>
                </Stack>
              </Stack>

              <br />
              <Stack border='1px solid black' padding={2}>
                <Typography variant='h5'>Your current active timers</Typography>
                <Divider />
                <br />
                <Stack spacing={1}>
                  <DisplayTimers />
                </Stack>
              </Stack>
            </>
          }
        </>
        :""
      }
    </Container>
  )
}
