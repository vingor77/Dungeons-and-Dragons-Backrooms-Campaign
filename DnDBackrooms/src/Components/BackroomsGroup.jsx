import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardContent, Divider, Link, List, ListItem, ListItemText, Stack, Tab, Tabs, Typography } from '@mui/material'
import React from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function BackroomsGroup(props) {
  const DisplayGroupInfo = () => {
    const introSpeechInfo = props.currGroup.introSpeech.split(":");

    return (
      <>
        <Card>
          <CardContent>
            <Typography variant='h4' textAlign='center' sx={{textDecoration: 'underline'}}>{props.currGroup.name}</Typography>
            <Typography textAlign='center'><b>Who are we?</b> {props.currGroup.purpose}</Typography>
            {introSpeechInfo[0] === "None" ? "" : <Typography><b>{introSpeechInfo[0]}:</b> "{introSpeechInfo[1]}"</Typography>}
          </CardContent>
        </Card>
        {props.currGroup.relations[0] === 'None' ? 
          ""
        :
          props.currGroup.subGroups[0] !== 'None' ?
            <Stack direction='row' spacing={2}>
              <Box width='50%'>
                <Typography textAlign='center' sx={{textDecoration: 'underline'}}>Relations</Typography>
                <Typography textAlign='center'>Current relations with the {props.currGroup.name} is Tier {props.currGroup.relations[0]} with {props.currGroup.relations[1]} points towards the next tier.</Typography>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>Tier rewards</AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {props.currGroup.tiers.map((tier, index) => {
                        return (
                          index + 1 <= props.currGroup.relations[0] ?
                            <ListItem>
                              <ListItemText>[{index + 1}]: {tier}. <b>Achieved</b></ListItemText>
                            </ListItem>
                          :
                            <ListItem>
                              <ListItemText>[{index + 1}]: {tier}</ListItemText>
                            </ListItem>
                        )
                      })}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </Box>
              <Box width='50%'>
                <Typography textAlign='center' sx={{textDecoration: 'underline'}}>Sub groups</Typography>
                <Typography textAlign='center'>Smaller groups that make up the {props.currGroup.name}</Typography>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>Sub groups</AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {props.currGroup.subGroups.map((group, index) => {
                        const groupNames = group.split(":");
                        return (
                          <ListItem>
                            <ListItemText><b>{groupNames[0]}:</b> {groupNames[1]}</ListItemText>
                          </ListItem>
                        )
                      })}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Stack>
          :
            <Box>
              <Typography textAlign='center' sx={{textDecoration: 'underline'}}>Relations</Typography>
              <Typography textAlign='center'>Current relations with the {props.currGroup.name} is Tier {props.currGroup.relations[0]} with {props.currGroup.relations[1]} points towards the next tier.</Typography>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>Tier rewards</AccordionSummary>
                <AccordionDetails>
                  <List>
                    {props.currGroup.tiers.map((tier, index) => {
                      return (
                        index + 1 <= props.currGroup.relations[0] ?
                          <ListItem>
                            <ListItemText>[{index + 1}]: {tier}. <b>Achieved</b></ListItemText>
                          </ListItem>
                        :
                          <ListItem>
                            <ListItemText>[{index + 1}]: {tier}</ListItemText>
                          </ListItem>
                      )
                    })}
                  </List>
                </AccordionDetails>
              </Accordion>
            </Box>
        }
        {props.currGroup.name === 'EOA' ?
          <HandleEOA />
        :
          ""
        }
      </>
    )
  }

  const HandleEOA = () => {
    return (
      <>
        <Box>
          <Typography textAlign='center' sx={{textDecoration: 'underline'}}>Sin levels</Typography>
          <Typography textAlign='center'>This guages how sinful the EOA believes each group is</Typography>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>Sins</AccordionSummary>
            <AccordionDetails>
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
            </AccordionDetails>
          </Accordion>
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
