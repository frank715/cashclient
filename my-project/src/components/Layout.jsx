import React from 'react'
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

export const Layout = ({children}) => {
  return (
    <div>
        <div>
           <Outlet />
        </div>
        {/* <div>
            <Footer />
        </div> */}
    </div>
  )
}
