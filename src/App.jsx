import { Link, Route, Routes } from 'react-router-dom';
import React from 'react';
import './index.css';
import Main1 from './Main1';
import Log from './Log'
import Opinions from './Opinions';
import Aboutus from './Aboutus';
import Purchase from './Purchase';
import Nova from './Nova';
import Book1arb from './Book1arb';
import Book1eng from './Book1eng';


function App() {
  return (
   <Routes>
<Route path='/' element={<Main1/>}></Route>
<Route path='login' element={<Log/>}></Route>
<Route path='/Opinions' element={<Opinions/>}></Route>
<Route path='Aboutus'element={<Aboutus/>}></Route>
<Route path='/Purchase' element={<Purchase/>}></Route>
<Route path='/Nova' element={<Nova/>}></Route>
<Route path='/Book1arb' element={<Book1arb/>}></Route>
<Route path='/Book1eng' element={<Book1eng/>}></Route>

   </Routes>
  )
}

export default App;