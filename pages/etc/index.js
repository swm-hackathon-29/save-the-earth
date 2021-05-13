import { style } from 'd3'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
     <html lang="en" dir="ltr">
        <head>
           <meta charset="utf-8" />
           <title>koreaMap</title>
           <link rel="stylesheet" href="css/korea.css" />
        </head>
        <script type="text/javascript" src="js/d3.js"></script>
        <script type="text/javascript" src="js/korea.js"></script>
        <body>
           <div id="container"></div>
   	   <h1> hi </h1>
        </body>
      </html>
   );
}     
