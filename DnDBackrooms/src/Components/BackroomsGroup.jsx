import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardContent, Divider, Link, List, ListItem, ListItemText, Stack, Tab, Tabs, Typography } from '@mui/material'
import React from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function BackroomsGroup(props) {
  const DisplayGroupInfo = () => {
    let style = {};
    if(props.currGroup.subGroups[0] === 'None') {
      style = {
        width: {xs: '100%', md: '100%'}
      }
    }
    else {
      style = {
        width: {xs: '100%', md: '50%'}
      }
    }

    return (
      <>
        <Card>
          <CardContent>
            <Typography variant='h4' textAlign='center' sx={{textDecoration: 'underline'}}>{props.currGroup.name}</Typography>
            <Typography textAlign='center'>{props.currGroup.purpose}</Typography>
            {props.currGroup.introSpeech === "None" ? "" : <Typography textAlign='center'><b>Spoken by {props.currGroup.introSpeech['speaker']}:</b> "{props.currGroup.introSpeech['speech']}"</Typography>}
            <Stack direction={{xs: 'column', md: 'row'}} spacing={2}>
              {props.currGroup.relations[0] === 'None' ? "" :
                <Box sx={style} border='1px solid black' marginTop={3}>
                  <Typography textAlign='center' sx={{textDecoration: 'underline'}}>Relations</Typography>
                  <Typography textAlign='center'>Current relations with the {props.currGroup.name} is Tier {props.currGroup.relations[0]} with {props.currGroup.relations[1]} points towards the next tier.</Typography>
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
                <Box border='1px solid black'>
                  <Typography textAlign='center' sx={{textDecoration: 'underline'}}>Sub groups</Typography>
                  <Typography textAlign='center'>Smaller groups that make up the {props.currGroup.name}</Typography>
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
    return (
      <>
        <Box>
          <Typography textAlign='center' sx={{textDecoration: 'underline'}}>Sin levels</Typography>
          <Typography textAlign='center'>This guages how sinful the EOA believes each group is</Typography>
          <Stack direction='row'>
            <Box width='25%'>
              <Typography textAlign='center' sx={{textDecoration: 'underline'}}>No sin</Typography>
              <Stack spacing={1}>
                {props.currGroup.noSin.map((sinner, index) => {
                  return (
                    <Typography textAlign='center'>{sinner}</Typography>
                  )
                })}
              </Stack>
            </Box>
            <Box width='25%'>
              <Typography textAlign='center' sx={{textDecoration: 'underline'}}>Low sin</Typography>
              <Stack spacing={1}>
                {props.currGroup.lowSin.map((sinner, index) => {
                  return (
                    <Typography textAlign='center'>{sinner}</Typography>
                  )
                })}
              </Stack>
            </Box>
            <Box width='25%'>
              <Typography textAlign='center' sx={{textDecoration: 'underline'}}>Moderate sin</Typography>
              <Stack spacing={1}>
                {props.currGroup.midSin.map((sinner, index) => {
                  return (
                    <Typography textAlign='center'>{sinner}</Typography>
                  )
                })}
              </Stack>
            </Box>
            <Box width='25%'>
              <Typography textAlign='center' sx={{textDecoration: 'underline'}}>High sin</Typography>
              <Stack spacing={1}>
                {props.currGroup.highSin.map((sinner, index) => {
                  return (
                    <Typography textAlign='center'>{sinner}</Typography>
                  )
                })}
              </Stack>
            </Box>
          </Stack>
        </Box>
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
