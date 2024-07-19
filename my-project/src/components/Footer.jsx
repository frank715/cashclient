"use client"
import React from 'react'

const Footer = () => {
    const year = new Date().getFullYear();
  return (
    <div className='bg-[#239C74] text-[10px] md:text-[16px] text-white fixed bottom-[0] w-full text-center p-2'>
      <p>
      Purchase of lottery using this website is strictly prohibited in the 
      state where lotteries are banned,You must be above 18 Years to play online lottery
      </p>
      <p>
      ©{`${year}`} ALL RIGHTS RESERVED. <a href="https://www.cashcrazegame.com" target='_blank'>  https://www.cashcrazegame.com </a>
      </p>
    </div>
  )
}

export default Footer
