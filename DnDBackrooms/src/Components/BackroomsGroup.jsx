import { Button, Link, Typography } from '@mui/material'
import React from 'react'

export default function BackroomsGroup(props) {
  const DisplayGroupInfo = () => {
    return (
      <>
        <Typography variant='h2'>{props.currGroup.name}</Typography>
        <Typography variant='h5'>Purpose:</Typography>
        <Typography variant='body1' sx={{textIndent: 25}}>{props.currGroup.purpose}</Typography>
        <Typography variant='h5'>Introduction speech:</Typography>
        <Typography variant='body1' sx={{textIndent: 25}}>{props.currGroup.introSpeech}</Typography>
        <Typography variant='h5'>Current relation levels:</Typography>
        {props.currGroup.relations[0] === 'None' ? 
          <Typography variant='body1'>Relations cannot be had with this group.</Typography>:
          <>
            <Typography variant='body1'>You are currently at Tier {props.currGroup.relations[0]}/10 with {props.currGroup.relations[1]}/5 points.</Typography>
            {props.currGroup.tiers[0] === 'None' ? "" :
              <>
                <Typography variant='h5'>Tier rewards:</Typography>
                <ul>
                  {props.currGroup.tiers.map((tier, index) => {
                    return <li key={index}><b>Tier {index + 1}:</b> {tier}</li>
                  })}
                </ul>
              </>
            }
          </>
        }
        {props.currGroup.subGroups[0] === 'None' ?
        "":
        <>
          <Typography variant='h5'>Sub groups:</Typography>
          <ul>
            {props.currGroup.subGroups.map((sub, index) => {
              const cut = sub.split(":");
              return <li key={index}><b>{cut[0]}:</b>{cut[1]}</li>
            })}
          </ul>
        </>}
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
