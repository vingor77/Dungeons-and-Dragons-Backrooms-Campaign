import { Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import { storage } from '../Components/firebase';

export default function BackroomsOutposts(props) {
  const [currOutpost, setCurrOutpost] = useState(null);
  const [shopImages, setShopImages] = useState([]);

  useEffect(() => {
    if(currOutpost === null) return;

    let post;
    for(let i = 0; i < props.outposts.length; i++) {
      if(currOutpost === props.outposts[i].name) {
        post = props.outposts[i];
      }
    }

    const storageRef = ref(storage, 'shops/' + post.name);

    let tempImages = [];
    listAll(storageRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          tempImages.push(url);
        })
      })
    })
    setShopImages(tempImages);

  }, [currOutpost])

  const CreateOutpostGrid = () => {
    const dataGridCols = [
      { field: 'id', headerName: 'ID', width: 90},
      { 
        field: 'name', 
        headerName: 'Outpost Name', 
        width: 250 
      },
      {
        field: 'group',
        headerName: 'Belongs to',
        width: 250,
      },
      {
        field: 'location',
        headerName: 'Location',
        width: 250,
      },
    ];
  
    let count = 0;
    const dataGridRows = [];

    props.outposts.map(outpost => {
      count++;
      const row = {
        id: count,
        name: outpost.name,
        group: outpost.group,
        location: outpost.location,
      }
      dataGridRows.push(row);
    })

    return (
      <DataGrid
        onRowClick={(dataGridRows) => {setCurrOutpost(dataGridRows.row.name)}}
        rows={dataGridRows}
        columns={dataGridCols}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            }
          },
          columns: {
            columnVisibilityModel: {
              id: false
            }
          }
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    )
  }

  return (
    <>
      {props.outposts.length > 0 ?
        <>
          <CreateOutpostGrid />
          {props.outposts.map((outpost, index) => {
            return (
              <div key={index}>
                {outpost.name === currOutpost ?
                  <>
                    <Typography variant='h2'>{outpost.name}</Typography>
                    <Typography variant='h5'>Description:</Typography>
                    <Typography variant='body1' sx={{textIndent: 25}}>{outpost.description}</Typography>
                    <Typography variant='h5'>Notable people:</Typography>
                    <ul>
                      {outpost.notablePeople.map((person, index) => {
                        return <li key={index}>{person}</li>
                      })}
                    </ul>
                    {outpost.hasShops && shopImages.length > 0 ?
                      <>
                        <Typography variant='h5'>Shops:</Typography>
                        {shopImages.map((image, index) => {
                          return (
                            <>
                              <Typography variant='body1'>Shop {index + 1}</Typography>
                              <img src={image} key={index} />
                            </>
                          )
                        })}
                      </>
                      :""
                    }
                  </>
                  :""
                }
              </div>
            )
          })}
        </>
        :""
      }
    </>
  )
}
