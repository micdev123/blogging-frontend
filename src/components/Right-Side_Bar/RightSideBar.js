import React from 'react'
import './right-side-bar.css'
import { MostRead } from '../Most-Read-Posts/MostRead'
import { RightSideCategory } from '../Right-Side-Category/RightSideCategory'

export const RightSideBar = () => {
    return (
        <div className='Right_Side_Bar_Component'>
            <div className='Categories'>
                <RightSideCategory />
            </div>
            <div className='Most_Read_Posts'>
                <MostRead />
            </div>
        </div>
    )
}
