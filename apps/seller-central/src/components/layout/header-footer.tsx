import React from 'react'
import Header from '../nav/header'
import Footer from '../footer/footer'

const HeaderFooter = ({children}: {children: React.ReactNode}) => {
  return (
    <div>
        <Header />
        {children}
        <Footer />
    </div>
  )
}

export default HeaderFooter