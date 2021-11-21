import React from 'react';
import google from '../assets/images/google.png';
export default function Home() {
  return (
    <div className='home-component'>
      <img src={google} />
      <div className='home-body'>
        <h1>Welcome to Geo G-Search</h1>
        <p>
          Geo G-Search is a extended search engine backed by google search APIs that primarily focus on providing
          relevant results that are from the selected country.
        </p>
      </div>
    </div>
  );
}
