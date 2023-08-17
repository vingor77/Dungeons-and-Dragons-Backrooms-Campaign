import { collection, onSnapshot, doc, addDoc, orderBy, query } from 'firebase/firestore'
import db from '../Components/firebase'
import React, { useEffect, useState } from 'react'
import Item from '../Components/BackroomsItem';

export default function Items() {
  const [items, setItems] = useState([]);
  const [itemIndex, setItemIndex] = useState(-1);

  const collectionRef = collection(db, 'items');

  useEffect(() => {
    const q = query(collectionRef, orderBy("itemNum", "asc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const objects = [];
      querySnapshot.forEach((doc) => {
        objects.push(doc.data());
      })
      setItems(objects);
    })

    return () => {
      unsub();
    }
  }, [])

  const displayItem = index => {
    setItemIndex(index);
  }

  return (
    <div className='items'>
      <div className='iteminfo'>
        <h1>Item info and pricing</h1>
        <p>
          Items of item number 0 are custom and magical, not innate to the Backrooms. Magic item prices work per regular D&D rules such as a rare is 2,000 to 20,000 gold, which translates to 4 to 40 almond water.
          Almond water is the only unbuyable resource within the game but sells for 1, 2, 3, and 4 depending on type as shown in the table below.
          Note: Almond water is worth the equivalent of 500 gold in D&D.
        </p>
        <ItemPrices />
        <p><b>Prices may vary.</b></p>
      </div>
      {items.map((item, index) => {
        return (
          <button onClick={() => {displayItem(index)}}>{item.name}</button>
        );
      })}
      {itemIndex >= 0 ? 
        <Item 
          name={items[itemIndex].name}
          itemNum={items[itemIndex].itemNum}
          rarity={items[itemIndex].rarity}
          locations={items[itemIndex].locations}
          artifactPrice={items[itemIndex].artifactPrice}
          description={items[itemIndex].description}
          table={items[itemIndex].table}
        />: ""}
    </div>
  )
}

function ItemPrices() {
  var tableStyle = {
    textAlign: 'center',
  }

  //TODO: Make 100/7% long
  var cellStyle = {
    border: '1px solid black',
    textAlign: 'center',
    width: '14%',
  }

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={cellStyle}>Type</th>
          <th style={cellStyle}>Buy price</th>
          <th style={cellStyle}>Tier 0</th>
          <th style={cellStyle}>Tier 3</th>
          <th style={cellStyle}>Tier 5</th>
          <th style={cellStyle}>Tier 6</th>
          <th style={cellStyle}>Tier 9</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={cellStyle}>Common</td>
          <td style={cellStyle}>1. The quantity varies per object</td>
          <td style={cellStyle}>0</td>
          <td style={cellStyle}>0</td>
          <td style={cellStyle}>0</td>
          <td style={cellStyle}>0</td>
          <td style={cellStyle}>0</td>
        </tr>
        <tr>
          <td style={cellStyle}>Uncommon</td>
          <td style={cellStyle}>2</td>
          <td style={cellStyle}>1</td>
          <td style={cellStyle}>1</td>
          <td style={cellStyle}>1</td>
          <td style={cellStyle}>1.5</td>
          <td style={cellStyle}>1.5</td>
        </tr>
        <tr>
          <td style={cellStyle}>Rare</td>
          <td style={cellStyle}>6</td>
          <td style={cellStyle}>3</td>
          <td style={cellStyle}>3</td>
          <td style={cellStyle}>3.5</td>
          <td style={cellStyle}>4</td>
          <td style={cellStyle}>5</td>
        </tr>
        <tr>
          <td style={cellStyle}>Very Rare</td>
          <td style={cellStyle}>10</td>
          <td style={cellStyle}>5</td>
          <td style={cellStyle}>5.5</td>
          <td style={cellStyle}>6</td>
          <td style={cellStyle}>7</td>
          <td style={cellStyle}>8</td>
        </tr>
        <tr>
          <td style={cellStyle}>Legendary</td>
          <td style={cellStyle}>14</td>
          <td style={cellStyle}>7</td>
          <td style={cellStyle}>8</td>
          <td style={cellStyle}>8.5</td>
          <td style={cellStyle}>10</td>
          <td style={cellStyle}>11</td>
        </tr>
        <tr>
          <td style={cellStyle}>Artifact</td>
          <td style={cellStyle}>5 times more than the sell price</td>
          <td style={cellStyle}>Varies depending on the artifact. Specified in the item description itself.</td>
          <td style={cellStyle}>N/A</td>
          <td style={cellStyle}>N/A</td>
          <td style={cellStyle}>N/A</td>
          <td style={cellStyle}>N/A</td>
        </tr>
        <tr>
          <td style={cellStyle}>One-of-a-kind</td>
          <td style={cellStyle}>N/A</td>
          <td style={cellStyle}>N/A</td>
          <td style={cellStyle}>N/A</td>
          <td style={cellStyle}>N/A</td>
          <td style={cellStyle}>N/A</td>
          <td style={cellStyle}>N/A</td>
        </tr>
      </tbody>
    </table>
  );
}