import { Button, Typography } from '@mui/material';
import React, { useState } from 'react'

export default function BackroomsOutposts(props) {
  const [showShops, setShowShops] = useState(false);

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
        {props.outpost.hasShops ?
        <>
          <Button onClick={() => setShowShops(!showShops)}>Show/Hide shops</Button>
          {showShops ? 
          <>
            <Typography variant='h5'>Shops:</Typography>
            {props.shopImages.map((image, index) => {
              return (
                <div key={index}>
                  <Typography variant='body1'>Shop {index + 1}</Typography>
                  <img src={image} key={index} />
                </div>
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
