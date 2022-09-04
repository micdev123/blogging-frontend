import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async';
import { Category } from '../../components/Category/Category'
import { Header } from '../../components/Header/Header'
import { Posts } from '../../components/Posts/Posts'

import { HiCubeTransparent } from 'react-icons/hi'

import './home.css'
import { RightSideBar } from '../../components/Right-Side_Bar/RightSideBar'
import { ScrollToTop } from '../../components/ScrollToTop';

export const Home = () => {
    const [rightBar, setRightBar] = useState(false);
   
    return (
        <div className={!rightBar ? 'Home_Component' : 'Set_Fixed'}>
            <div className={!rightBar ? 'Display_None' : 'Overlay'}></div>
            <Helmet>
                <title>Blogging</title>   
            </Helmet>
            <Header />
            <ScrollToTop />
            <div className='Main_Container'>
                <Category />
                <Posts />
            </div>
            
            <div className='Right_Sidebar_Icon'>
                <HiCubeTransparent className='icon' onClick={() => setRightBar(!rightBar)} />
            </div>
            {rightBar && (
                <div className='Right_Side_Component Dark_Mode_Background'>
                    <RightSideBar />
                </div>
            )}
            
        </div>
    )
}
