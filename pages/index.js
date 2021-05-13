import { style } from 'd3'
import Head from 'next/head'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import MyAppBar from '../components/MyAppBar'
import MyList from '../components/MyList'
import axios from 'axios'

export async function getServerSideProps(context) {
  console.log(context.req.headers.host)
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
    console.log(topCities)
  }
  return { props: { topCities } }
}

export default function Home(props) {
  useEffect(() => {/*
    function geoFindMe() {

      const status = document.querySelector('#status');
      const mapLink = document.querySelector('#map-link');
    
      mapLink.href = '';
      mapLink.textContent = '';
    
      function success(position) {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;
    
        status.textContent = '';
        mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
        mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
      }
    
      function error() {
        status.textContent = 'Unable to retrieve your location';
      }
    
      if(!navigator.geolocation) {
        status.textContent = 'Geolocation is not supported by your browser';
      } else {
        status.textContent = 'Locating…';
        navigator.geolocation.getCurrentPosition(success, error);
      }
    
    }
    
    document.querySelector('#find-me').addEventListener('click', geoFindMe);
    */
  });

  return (
    <>
      <Head>
        <title>지구를 지켜라!</title>
        <meta name="description" content="지구를 지켜라" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MyAppBar title="지구를 지켜라!"/>

      <main>
        <button id = "find-me">Show my location</button><br/>
        <p id = "status"></p>
        <a id = "map-link" target="_blank"></a>
        <MyList title={'월간 TOP10 도시'} items={
          props.topCities.slice(0, 10).map((city) => ({title: `${city.citySidoName} ${city.citySggName}`}))
        }/>
        <MyList/>
      </main>
    </>
  )
}
