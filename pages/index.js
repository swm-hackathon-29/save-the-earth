import { style } from 'd3'
import Button from '@material-ui/core/Button';
import Head from 'next/head'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import MyAppBar from '../components/MyAppBar'
import MyList from '../components/MyList'
import axios from 'axios'

export async function getServerSideProps(context) {
  const date = new Date()
  
  let topCities = []
  while (topCities.length === 0 && date.getFullYear() > 2018) {
    topCities = (await axios.get(`http://${context.req.headers.host}/api/wastes/all`, {
      params: {
        year: date.getFullYear(),
        month: date.getMonth() + 1
      }
    }))
    .data
    .filter((city) => Object.values(city)[0].length > 0)
    .flatMap((city) => Object.values(city)[0][0])
    .sort((a, b) => b.disDate - a.disDate)
    date.setMonth(date.getMonth() - 1)
  }
  return { props: { topCities } }
}

export default function Home(props) {
  const [coords, setCoords] = useState(null)
  const [myApt, setMyApt] = useState(null)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const [latitude, longitude] = [position.coords.latitude, position.coords.longitude]
        setCoords({latitude, longitude}),
        axios.get(`http://${location.host}/api/apartments`, {
          params: {
            latitude,
            longitude,
            neighbors: 1
          }
        }).then((res) => setMyApt(Object.values(res.data)[0]))
        .catch((err) => alert(err.data))
      },
      () => alert('Unable to use Geo API')
    );
  }, []);

  return (
    <>
      <Head>
        <title>지구를 지켜라!</title>
        <meta name="description" content="지구를 지켜라" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MyAppBar title="지구를 지켜라!"/>
      <main>
        <Button variant="contained">
          { coords ? `${coords.latitude}, ${coords.longitude} ${myApt?.aptName}` : '위치 찾기' }
        </Button>

        <MyList title={'월간 TOP10 도시'} items={
          props
          .topCities
          .slice(0, 10)
          .map((city) => ({title: `${city.citySidoName} ${city.citySggName}`}))
        }/>
        <MyList/>
      </main>
    </>
  )
}
