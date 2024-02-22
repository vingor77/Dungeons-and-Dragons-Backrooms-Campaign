import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardContent, Chip, Divider, Link, List, ListItem, ListItemText, Stack, Tab, Tabs, Typography } from '@mui/material'
import React from 'react'

export default function BackroomsGroup(props) {
  const DisplayGroupInfo = () => {
    let style = {};
    if(props.currGroup.subGroups[0] === 'None') {
      style = {
        minWidth: {xs: '100%', md: '100%'}
      }
    }
    else {
      style = {
        minWidth: {xs: '100%', md: '50%'}
      }
    }

    return (
      <>
        <Card>
          <CardContent>
            <Typography textAlign='center' sx={{textDecoration: 'underline'}} variant='h4'>{props.currGroup.name}</Typography>
            <Typography textAlign='center'>{props.currGroup.purpose}</Typography>
            {props.currGroup.introSpeech === "None" ? 
              "" 
            :
              <>
                <br />
                <Divider />
                <br />
                <Typography textAlign='center'><b>Spoken by {props.currGroup.introSpeech['speaker']}:</b> "{props.currGroup.introSpeech['speech']}"</Typography>
              </>
            }
            <br />
            <Stack direction={{xs: 'column', md: 'row'}} spacing={2}>
              {props.currGroup.relations[0] === 'None' ? "" :
                <Box sx={style} border='1px solid black' marginTop={3}>
                  <Typography textAlign='center' sx={{textDecoration: 'underline'}}>Relation rewards</Typography>
                  <Typography textAlign='center'>You have {props.currGroup.relations[1]} points towards tier {parseInt(props.currGroup.relations[0]) + 1}</Typography>
                  <List>
                    {props.currGroup.tiers.map((tier, index) => {
                      return (
                        index + 1 <= props.currGroup.relations[0] ?
                          <ListItem key={index}>
                            <ListItemText>[{index + 1}]: {tier}. <b>Achieved</b></ListItemText>
                          </ListItem>
                        :
                          <ListItem key={index}>
                            <ListItemText>[{index + 1}]: {tier}</ListItemText>
                          </ListItem>
                      )
                    })}
                  </List>
                </Box>
              }
              {props.currGroup.subGroups[0] === 'None' ?
                ""
              :
                <Box border='1px solid black' width={{xs: '100%', md: '50%'}}>
                  <Typography textAlign='center' sx={{textDecoration: 'underline'}}>Sub groups</Typography>
                  <List>
                    {props.currGroup.subGroups.map((group, index) => {
                      const groupNames = group.split(":");
                      return (
                        <ListItem key={index}>
                          <ListItemText><b>{groupNames[0]}:</b> {groupNames[1]}</ListItemText>
                        </ListItem>
                      )
                    })}
                  </List>
                </Box>
              }
            </Stack>
            {props.currGroup.name === 'EOA' ?
              <HandleEOA />
            :
              ""
            }
          </CardContent>
        </Card>
      </>
    )
  }

  const HandleEOA = () => {
    const sinners = JSON.parse(props.currGroup.sins);
    const keys = Object.keys(sinners);

    return (
      <>
        <br />
        <Typography textAlign='center' variant='h5' sx={{textDecoration: 'underline'}}>Sin levels</Typography>
        <br />
        <Stack direction='row' flexWrap='wrap' gap={1}>
          {keys.map((key, index) => {
            return (
              <Card sx={{border: '1px solid black', width: '250px'}}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography>{sinners[key].name}: </Typography>
                    <Chip label={sinners[key].rating} flex={1} />
                  </Stack>
                </CardContent>
              </Card>
            )
          })}
        </Stack>
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