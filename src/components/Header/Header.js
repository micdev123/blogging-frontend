import React from 'react'
import { Link } from 'react-router-dom'

import './header.css'

export const Header = () => {
    return (
        <div className='Header_Component'>
            <div className='Header_Container'>
                <div className='Header_contents'>
                    <h2>Discover other's thought and share your own.</h2>
                    <p>
                        Document you journey, learn from others, your thought is needed one way or the other it might serve as a stepping stone for others...
                    </p>
                    <Link to='/login' className='Header_btn'>
                        Start reading
                    </Link>
                </div>
                <div className='Header_Image'>
                    <img src='./assets/blog1.png' alt='' />
                </div>
            </div>
        </div>
    )
}
