import { Box, Button, Link, Stack, Typography } from '@mui/material'
import React from 'react'

export default function BackroomsGroup(props) {
  const DisplayGroupInfo = () => {
    return (
      <>
        <Typography variant='h5'><b>{props.currGroup.name}:</b> <Typography variant='body1' display='inline'>{props.currGroup.purpose}</Typography></Typography>
        <Typography variant='h5'><b>Intro:</b> <Typography variant='body1' display='inline'>{props.currGroup.introSpeech}</Typography></Typography>
        {props.currGroup.relations[0] === 'None' ? 
          <Typography variant='h5'><b>Relations:</b> <Typography variant='body1' display='inline'>Relations cannot be had with this group.</Typography></Typography>:
          <>
            <Typography variant='h5'><b>Relations:</b> <Typography variant='body1' display='inline'>You are currently at Tier {props.currGroup.relations[0]}/10 with {props.currGroup.relations[1]}/5 points. Rewards are shown below.</Typography></Typography>
            {props.currGroup.tiers[0] === 'None' ? "" :
              <>
                <Box display='flex' flexdirection='row' justifyContent='space-between'>
                  {props.currGroup.tiers.map((tier, index) => {
                    return (
                      index < 5 ?
                        <Typography variant='body1' key={index} border='1px solid black' width='20%'><b>({index + 1}):</b> {tier}</Typography>
                      :
                        ""
                    )
                  })}
                </Box>
                <Box display='flex' flexdirection='row' justifyContent='space-between'>
                  {props.currGroup.tiers.map((tier, index) => {
                    return (
                      index > 4 ?
                        <Typography variant='body1' key={index} border='1px solid black' width='20%'><b>({index + 1}):</b> {tier}</Typography>
                      :
                        ""
                    )
                  })}
                </Box>
              </>
            }
          </>
        }
        {props.currGroup.subGroups[0] === 'None' ?
          ""
        :
          <>
            <Typography variant='h5'>Sub groups:</Typography>
            <ul>
              {props.currGroup.subGroups.map((sub, index) => {
                const cut = sub.split(":");
                return <li key={index}><b>{cut[0]}:</b>{cut[1]}</li>
              })}
            </ul>
          </>
        }
        {props.currGroup.name === 'EOA' ?
        <HandleEOA />:
        ""}
      </>
    )
  }

  const HandleEOA = () => {
    return (
      <>
        <Typography variant='h5'>No sin groups:</Typography>
        <ul>
          {props.currGroup.noSin.map((sinner, index) => {
            return <li key={index}>{sinner}</li>
          })}
        </ul>
        <Typography variant='h5'>Low sin groups:</Typography>
        <ul>
          {props.currGroup.lowSin.map((sinner, index) => {
            return <li key={index}>{sinner}</li>
          })}
        </ul>
        <Typography variant='h5'>Medium sin groups:</Typography>
        <ul>
          {props.currGroup.midSin.map((sinner, index) => {
            return <li key={index}>{sinner}</li>
          })}
        </ul>
        <Typography variant='h5'>High sin groups:</Typography>
        <ul>
          {props.currGroup.highSin.map((sinner, index) => {
            return <li key={index}>{sinner}</li>
          })}
        </ul>
      </>
    )
  }

  return (
    <>
      {props.currGroup ?
        <DisplayGroupInfo />:
        ""
      }
    </>
  )
}
