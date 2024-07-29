import React  from 'react'
import { Notyf } from 'notyf';

export default React.createContext(
  new Notyf({
    duration: 1000 // Set your global Notyf configuration here
  })
);