import { collection, onSnapshot } from 'firebase/firestore'
import db from '../Components/firebase'
import React, { useEffect, useState } from 'react'
import { Button, Container, Divider, TextField, Typography } from '@mui/material';

export default function GeneralInfo() {
  const [uncoveredDocs, setUncoveredDocs] = useState([]);
  const [wifiStrength, setWifiStrength] = useState(0);
  const [roll, setRoll] = useState(1);
  const [availabeDocs, setAvailableDocs] = useState([]);
  const [showFunctions, setShowFunctions] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

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

  const DisplayInfo = () => {
    return (
      <>
        <div className='information'>
          <div className='houserules'>
            <Typography variant='h2'>House rules</Typography>
            <Typography variant='body1'>These are rules that has been decided upon for how the game is run.</Typography>
            <ul>
              <li>Full perkins crit</li>
              <li>Keep track of ammunition, rations, and time passed within game.</li>
              <li>1 ration is required per day.</li>
              <li>Maximum carry limit of 100 Backrooms specific items. This does not include magic items, armor, shields, weapons, or ammo.</li>
              <li>Fully implemented fleeing system for fights too difficult to win.</li>
              <li>Any effects that recharge after 24 hours also resets on a long rest.</li>
            </ul>
          </div>
          <div className='fleeing'>
          <Typography variant='h2'>Fleeing rules</Typography>
            <Typography variant='body1'>
              Fleeing is a mechanic that may be instatiated before you act on your turn.
              The first step to fleeing is moving up to your movement speed away.
              Next, skills checks will be made until meeting one of the ending conditions.
            </Typography>
            <Typography variant='h4'>Skill checks:</Typography>
            <ul>
              <li><b>Stealth:</b> Hide from the enemy</li>
              <li><b>Athletics or Acrobatics:</b> Run away. This includes anything from jumping up ledges and slopes to good old fashion running.</li>
              <li><b>Nature:</b> Blend within the environment. Similar to stealth but may give advantage or disadvantage depending on the environment.</li>
              <li><b>Deception:</b> Throw off your trail by some means.</li>
              <li><b>Others:</b> If a skill check comes to mind that is not listed and would work for the situation, it may be used.</li>
            </ul>
            <Typography variant='body1'>
              Each check has a DC of 10, 15, 20, 25, or 30 based on how many times a specific skill has been used in the same fleeing encounter. The DC increases regardless of the result.
              For example, using stealth once is DC 10, then twice is DC 15, and three times is DC 20. Then, if you use Nature the DC is 10. Each DC increase is skill specific.
            </Typography>
            <Typography variant='h4'>Ending conditions:</Typography>
            <ul>
              <li>Four <b>successful</b> skill checks result in escape. This considers you out of combat.</li>
              <li>Four <b>failed</b> skill checks result in being caught. This then resumes normal combat where your initiative becomes 0. This also removes the option to try to flee again.</li>
              <li>If you have begun to flee and your <b>second</b> turn(after the initial) comes around with another ally still in combat, you may choose to either automatically escape or freely re-enter the combat. Re-entering the combat takes your entire turn.</li>
            </ul>
          </div>
          <div className='generalworkings'>
            <Typography variant='h2'>General information</Typography>
            <Typography variant='body1'><b>Time:</b> Determines how fast time flows within a level. This changes the time added per distance traveled by up to 2x or down to 0.5x</Typography>
            <Typography variant='bod1'><b>Wi-Fi:</b> Determines how well the Wi-Fi works. Wi-Fi is classified on a scale from 0 to 100 percent where 0 means not working and 100 means always working.</Typography>
            <ul>
              <li>Wi-Fi also determines what uncovered documents are accessible at any given time. In order to figure this out, 1D100 needs to be rolled.</li>
              <li>Once rolled, the formula to find Wi-Fi effectiveness is: (roll * (Wi-Fi / 100)). For example a roll of 50 with a Wi-fi strength of 50 leads to (50 * (50/100)) = 25%</li>
              <li>The Wi-Fi effectiveness tells what percentage of uncovered documents may be looked at. This is done for you in the player fuctions tab.</li>
              <li>Moving to a new level or sub-layer causes the Wi-Fi to alter, also changing the documents.</li>
            </ul>
            <Typography variant='body1'><b>Sanity Drain Class:</b> A number to represent how much sanity is lost. This ranges from 0 to 10 where 0 means nothing while a 10 means 10 sanity per 30 minutes.</Typography>
            <Typography variant='body1'>
              <b>Sanity Drain Type:</b> How sanity is drained. This is represented as time passing. Default sanity drain type is 3 minutes per newly generated map. If the drain is not default, it will be noted in the file for that level.
            </Typography>
            <Typography variant='body1'>
              <b>Sanity:</b> How sane you currently are. Sanity starts at 100 sanity and drops by sanity drain class every 30 minutes. The time that passes is based on the (sanity drain type times the time speed).<br />
              Sanity does not drain while inside of safe areas such as outposts.<br />
              When reaching certain thresholds, debuffs apply as listed below:
            </Typography>
            <ul>
              <li><b>50 sanity:</b> Reduce any one stat by 1 or maximum health by 10. This is removed when sanity reaches 50 or above.</li>
              <li><b>25 sanity:</b> Reduce any one stat by 1 or maximum health by 10. This is removed when sanity reaches 25 or above.</li>
              <li><b>0 sanity:</b> Upon hitting 0 sanity, you are considered insane. First, make a DC 10 Wisdom saving throw.
              <ul>
                <li>On a pass, nothing happens but the DC raises by 5, up to a maximum of 30.</li>
                <li>On a fail, gain a level of exhaustion.</li>
                <li>This saving throw is remade every 10 minutes while at 0 sanity.</li>
              </ul></li>
            </ul>
            <Typography variant='body1'><b>Survival Difficulty Class:</b> A number or word shown to represent how difficult the level is to survive on. This can be anything from 0(Safe) to 5(Extremely deadly) or some phrase such as Deadzone or N/A.</Typography>
          </div>
        </div>
      </>
    )
  }

  return (
    <Container>
      <Button variant='outlined' onClick={() => setShowInfo(!showInfo)}>Show/Hide player information</Button>
      <Button variant='outlined' onClick={() => setShowFunctions(!showFunctions)}>Show/Hide player functions</Button>
      {showInfo ? <DisplayInfo />: ""}
      {showFunctions ? 
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
    </Container>
  );
}