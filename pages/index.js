import { style } from 'd3'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, { useState, useEffect } from 'react';

export default function Home() {
  useEffect(() => {
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
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.haederInner}>
        <span>대충 아무요소</span>
        <span>대충 아무요소</span>
        <span>대충 아무요소</span>
      </div>
      <main className={styles.main}>
        

        <h1 className={styles.title}>
        지구를 지켜라
        </h1>
        <button id = "find-me">Show my location</button><br/>
        <p id = "status"></p>
        <a id = "map-link" target="_blank"></a>
        
        <div className={styles.section}>
          <div className={styles.cont}> 
            <div className={styles.topRank}>
              <div className={styles.c}>
                TOP 3
              </div>
              <div>
                <div className={styles.c}>
                  지자체
                </div><div className={styles.c}>
                  아파트
                </div> 
              </div>
            </div>

            <div className={styles.map}>
              지도
            </div>
          </div>
        </div>

        <div className={styles.box}>
          <div>
            <div className={styles.c}>아파트 주소</div>
            <div className={styles.c}>우리동네 어쩌구</div>
            </div>
            <div className={styles.c}>
                <span >뉴스</span>
                <ul>  
                  <li >뉴스1</li>
                <li>뉴스2</li>
              </ul>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
