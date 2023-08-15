import { collection, onSnapshot } from 'firebase/firestore'
import db from '../Components/firebase'
import React, { useEffect, useState } from 'react'
import Item from '../Components/BackroomsItem';

export default function Items() {
  const [items, setItems] = useState([]);
  const [itemIndex, setItemIndex] = useState(-1);

  const collectionRef = collection(db, 'items');

  useEffect(() => {
    const unsub = onSnapshot(collectionRef, (querySnapshot) => {
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
