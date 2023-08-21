import { collection, onSnapshot } from 'firebase/firestore'
import db from '../Components/firebase'
import React, { useEffect, useState } from 'react'
import { Container } from '@mui/material';

export default function GeneralInfo() {
  const [uncoveredDocs, setUncoveredDocs] = useState([]);
  const [wifiStrength, setWifiStrength] = useState(0);
  const [roll, setRoll] = useState(0);
  const [availabeDocs, setAvailableDocs] = useState([]);
  const [showing, setShowing] = useState("btns");

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

    //TODO: Sort
    setAvailableDocs(pages);
  }

  const DisplayInfo = () => {
    return (
      <div className='information'>
        <div className='houserules'>
          <h1>House rules</h1>
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
          <h1>Fleeing</h1>
          <p>
            Fleeing is a mechanic that may be instatiated before you act on your turn.
            The first step to fleeing is moving up to your movement speed away.
            Next, skills checks will be made until meeting one of the ending conditions.
          </p>
          <h3>Skill checks:</h3>
          <ul>
            <li><b>Stealth:</b> Hide from the enemy</li>
            <li><b>Athletics or Acrobatics:</b> Run away. This includes anything from jumping up ledges and slopes to good old fashion running.</li>
            <li><b>Nature:</b> Blend within the environment. Similar to stealth but may give advantage or disadvantage depending on the environment.</li>
            <li><b>Deception:</b> Throw off your trail by some means.</li>
            <li><b>Others:</b> If a skill check comes to mind that is not listed and would work for the situation, it may be used.</li>
          </ul>
          <p>
            Each check has a DC of 10, 15, 20, 25, or 30 based on how many times a specific skill has been used in the same fleeing encounter. The DC increases regardless of the result.
            For example, using stealth once is DC 10, then twice is DC 15, and three times is DC 20. Then, if you use Nature the DC is 10. Each DC increase is skill specific.
          </p>
          <h3>Ending conditions:</h3>
          <ul>
            <li>Four <b>successful</b> skill checks result in escape. This considers you out of combat.</li>
            <li>Four <b>failed</b> skill checks result in being caught. This then resumes normal combat where your initiative becomes 0. This also removes the option to try to flee again.</li>
            <li>If you have begun to flee and your <b>second</b> turn(after the initial) comes around with another ally still in combat, you may choose to either automatically escape or freely re-enter the combat. Re-entering the combat takes your entire turn.</li>
          </ul>
        </div>
        <div className='generalworkings'>
          <h1>General information</h1>
          <p><b>Time:</b> Determines how fast time flows within a level. This changes the time added per distance traveled by up to 2x or down to 0.5x</p>
          <p>
            <b>Wi-Fi:</b> Determines how well the Wi-Fi works. This is on a scale from 0-100 where 0 means it never works and 100 means it always works.
            The practical use for this is to roll 1D100 then multiply it by the Wi-Fi strength as a decimal. For example, you roll a 50 when Wi-Fi is at 50, so you get 25% of your pages. These pages to be looked at last until the Wi-Fi strength changes or a new level/sub-layer is entered.
            Then, randomize the list of uncovered documents and take the first few based on your roll and Wi-Fi strength.
          </p>
          <p><b>Sanity Drain Class:</b> A number to represent how much sanity is lost. This ranges from 0 to 10 where 0 means nothing while a 10 means 10 sanity per timeframe.</p>
          <p>
            <b>Sanity Drain Type:</b> The way that sanity is drained. This changes based on location and level. There is standard, which is listed in the "sanity" section below. Non-standard is noted within the levels.
          </p>
          <p>
            <b>Sanity:</b> Starts at 100. Drops by sanity drain class per 30 minutes. 30 minutes passing it determined by the sanity drain type above.
            Standard sanity drain type is for every newly generated map, 6 minutes have passed. Sanity dropping too low results in debuffs.
            These debuffs are as follows:
          </p>
          <ul>
            <li><b>50% sanity:</b> Reduce any one stat by 1 or maximum health by 10. This is remedied by restoring sanity back to or over 50.</li>
            <li><b>25% sanity:</b> Reduce any one stat by 1 or maximum health by 10. This is remedied by restoring sanity back to or over 25.</li>
            <li><b>0% sanity:</b> Make a DC 10 Wisdom saving throw. On a success, the DC rises by 5 to a max of 30. On a fail, gain a level of exhaustion. This saving throw is made every 10 minutes while at 0%.</li>
          </ul>
          <p><b>Survival Difficulty Class:</b> A number or word shown to represent how difficult the level is to survive on. 0 is the lowest while 5 is the highest. There are some special SDC's such as Deadzone and N/A.</p>
        </div>
        <button onClick={() => setShowing("btns")}>Go back</button>
      </div>
    )
  }

  switch(showing) {
    case "btns":
      return (
        <Container>
          <div className='playerinfobtns'>
            <button onClick={e => setShowing("info")}>Show game information</button>
            <button onClick={() => setShowing("availablePages")}>Wi-Fi page calculator</button>
          </div>
        </Container>
      );
    case "info":
      return <DisplayInfo />
    case "availablePages":
      return (
        <Container>
          <div className='playerFunctions'>
            <label htmlFor='wifi'>Enter Wi-Fi value</label>
            <input type='number' value={wifiStrength} onChange={e => handleWifiStrength(e)} min="0" max="100" id='wifi'></input>
            <label htmlFor='roll'>Enter roll value</label>
            <input type='number' value={roll} onChange={e => handleRoll(e)} min="0" max="100" id='roll'></input>
            <button onClick={getPages}>Generate documents</button>
            <ul>
              {availabeDocs.map(item => {
                return <li>{item.pageName}</li>
              })}
            </ul>
            <button onClick={() => setShowing("btns")}>Go back</button>
          </div>
        </Container>
      )
  }
}