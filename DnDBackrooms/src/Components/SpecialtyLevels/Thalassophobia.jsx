import { Box, Button, Card, CardContent, Chip, Divider, Input, MenuItem, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import db from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function Thalassophobia(props) {
  const directions = ['North', 'South', 'East', 'West'];
  const [chosenDirection, setChosenDirection] = useState("North");
  const [value, setValue] = useState(0);

  const updateLocation = () => {
    let directionValues = props.playerLoc;

    if(chosenDirection === 'North') {
      directionValues[0] = parseInt(directionValues[0]) + parseInt(value);
      directionValues[1] = parseInt(directionValues[1]) - parseInt(value);
    }
    else if(chosenDirection === 'South') {
      directionValues[1] = parseInt(directionValues[1]) + parseInt(value);
      directionValues[0] = parseInt(directionValues[0]) - parseInt(value);
    }
    else if(chosenDirection === 'East') {
      directionValues[2] = parseInt(directionValues[2]) + parseInt(value);
      directionValues[3] = parseInt(directionValues[3]) - parseInt(value);
    }
    else {
      directionValues[3] = parseInt(directionValues[3]) + parseInt(value);
      directionValues[2] = parseInt(directionValues[2]) - parseInt(value);
    }

    updateDoc(doc(db, 'levels', 'Thalassophobia'), {
      "Player Location": directionValues
    });
  }

  return (
    <Box>
      <Stack direction={{xs: 'column', md: 'row'}} spacing={1} justifyContent="center" alignItems="center">
        <Stack border='1px solid black' padding='10px' spacing={1}>
          <Typography textAlign='center'>Change Direction</Typography>
          <Stack direction='row' spacing={1}>
            <TextField
              id="DirectionPicker"
              select
              label="Direction"
              defaultValue="North"
              helperText="Select Direction"
              onChange={(e) => setChosenDirection(e.target.value)}
            >
              {directions.map((direction, index) => {
                return (
                  <MenuItem key={index} value={direction}>
                    {direction}
                  </MenuItem>
                )
              })}
            </TextField>
            <TextField
              id="ValueChange"
              label="Value"
              type='number'
              helperText="Enter value"
              onChange={(e) => setValue(e.target.value)}
            />
          </Stack>
          <Button variant='outlined' onClick={() => updateLocation()}>Submit Change</Button>
        </Stack>
        <Stack border='1px solid black' padding='10px' spacing={1} sx={{minHeight: '155px'}}>
          <Typography textAlign='center'>Current Player Location</Typography>
          <Stack direction='row' spacing={{xs: 0, md: 1}} flexWrap='wrap' gap={1} justifyContent="space-between" alignItems="flex-start">
            {props.playerLoc.map((loc, index) => {
              return (
                <>
                  <TextField
                    key={index}
                    disabled 
                    value={directions[index] + ": " + loc}
                    helperText=" "
                    sx={{width: {xs: '100%', md: '150px'}}}
                  />
                </>
              )
            })}
          </Stack>
        </Stack>
      </Stack>
      <br />
      <Stack direction={{xs: 'column', md: 'row'}} flexWrap='wrap' gap={1} justifyContent="space-between" alignItems="flex-start">
        {Object.keys(props.content).map((zone, index) => {
          return (
            <>
              <Box width={{xs: '100%', md: '48%'}} border='1px solid black' minHeight='270px' padding='5px'>
                <Typography textAlign='center'><u>{props.content[zone].Name}</u></Typography>
                <Typography textAlign='center'>{props.content[zone].Description}</Typography>
                <Stack direction={{xs: 'column', md: 'row'}} justifyContent="space-between" alignItems="flex-start">
                  <Chip label={"Sanity Drain Class: " + props.content[zone]['Sanity Drain Class']} />
                  <Chip label={"Time flow: " + props.content[zone].Time} />
                </Stack>
                <br />
                <Box>
                  <Typography textAlign='center'><u>{props.content[zone].Name} events</u></Typography>
                  {Object.keys(props.content[zone].Events).map((event, index) => {
                    return (
                      <>
                        <Typography><b>{event}:</b> {props.content[zone].Events[event]}</Typography>
                        <Divider />
                      </>
                    )
                  })}
                </Box>
              </Box>
            </>
          )
        })}
      </Stack>
    </Box>
  )
}