import React from 'react'
import { Profile } from '../../components/Profile/Profile'
import { SettingSideBar } from '../../components/Setting-Sidebar/SettingSideBar'


import './settings.css'

export const Settings = () => {
    return (
        <div className='Settings_Component'>
            <div className='Main_Container'>
                <div className='Setting_Container'>
                    <SettingSideBar />
                    <Profile />
                </div>
            </div>
        </div>
    )
}
