import { style } from 'd3'
import Head from 'next/head'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import MyAppBar from '../components/MyAppBar'
import MyList from '../components/MyList'

export default function Home() {
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
        <MyList title={'TOP3 도시'} items={
          ['AAA시', 'BBB시', 'CCC시'].map((title) => ({title: title}))
        }/>
        <MyList/>
      </main>
    </>
  )
}
