// pages/confirm.js
"use client";

import { useState } from 'react';
import Nav from '../components/Nav'

export default function ConfirmPage() {
  const [message, setMessage] = useState('');

  const showConfirmation = () => {
    let userResponse = confirm("Do you want to proceed?");
    if (userResponse) {
      setMessage("You clicked Yes!");
    } else {
      setMessage("You clicked No!");
    }
  };

  return (
    <div>
      <Nav/>
      <button onClick={showConfirmation}>Click Me</button>
      {message && <p>{message}</p>}
    </div>
  );
}