import React from 'react'
import { Box, Container, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';

export default function GeneralInfo() {
  const DisplayInfo = () => {
    return (
      <>
        <div className='information'>
          <div className='houserules'>
            <Typography variant='h2'>House rules</Typography>
            <ol>
              <li>Full perkins crit</li>
              <li>Keep track of ammunition, rations, and time passed within game.</li>
              <li>1 ration is required per day.</li>
              <li>Any effects that recharge after 24 hours also resets on a long rest.</li>
              <li>Armor/Gear is slot based, similar to a video game. The slots are:
                <ul>
                  <li>Helmet</li>
                  <li>Chest</li>
                  <li>Arms</li>
                  <li>Belt</li>
                  <li>Leg</li>
                  <li>Ring x10</li>
                  <li>Necklace</li>
                  <li>Cloak</li>
                  <li>Main hand</li>
                  <li>Off hand</li>
                  <li>Miscellaneous</li>
                </ul>
              </li>
              <li>Due to anomalous darkness, darkvision is removed and replaced with either a AA flashlight with 4 extra batteries or a C lantern with 1 extra battery.</li>
              <li>There are 4 battery types, AA (8 hours), AAA(10 hours), C(30 hours), and D(40 hours).</li>
              <li>Flashlights have a range of 60 ft. in a cone while lanterns have a 30 ft. range in a radius.</li>
            </ol>
          </div>
          <div className='fleeing'>
            <Typography variant='h2'>Fleeing rules (under construction)</Typography>
          </div>
          <div className='generalworkings'>
            <Typography variant='h2'>General information</Typography>
            <Typography variant='body1'><b>Time:</b> A multiplier to alter the flow of time.</Typography>
            <Typography variant='body1'><b>Wi-Fi:</b> A numerical value to determine how well the Wi-Fi works.</Typography>
            <Typography variant='body1'>
              <b>Sanity:</b> A numerical value to represent how sane you are. The maximum is 100. Every 30 minutes, 1 sanity is removed unless within a safe area.
            </Typography>
            <Table sx={{width: '50%'}}>
              <TableBody>
                <TableRow>
                  <TableCell sx={{border: '1px solid black', textAlign: 'center'}}><b>While at or below 75 sanity</b></TableCell>
                  <TableCell sx={{border: '1px solid black', textAlign: 'center'}}><b>While at or below 50 sanity</b></TableCell>
                  <TableCell sx={{border: '1px solid black', textAlign: 'center'}}><b>While at or below 25 sanity</b></TableCell>
                  <TableCell sx={{border: '1px solid black', textAlign: 'center'}}><b>While at 0 sanity</b></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{border: '1px solid black'}}>Reduce any mental stat by 1 or maximum health by 10.</TableCell>
                  <TableCell sx={{border: '1px solid black'}}>Reduce any physical stat by 1 or maximum health by 15.</TableCell>
                  <TableCell sx={{border: '1px solid black'}}>Reduce any stat by 2 or maximum health by 20.</TableCell>
                  <TableCell sx={{border: '1px solid black'}}>Make a DC 10 Wisdom Saving Throw. On a pass, raise the DC by 5 (max 30). On a fail, gain 1 level of exhaustion. Remake this save every 10 minutes.</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </>
    )
  }

  return (
    <Box paddingLeft={5} paddingRight={5}>
      <DisplayInfo />
    </Box>
  );
}