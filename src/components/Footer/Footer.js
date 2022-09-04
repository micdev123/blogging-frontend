import React from 'react'
import { BsTwitter, BsInstagram, BsGithub } from 'react-icons/bs'
import { AiFillLinkedin } from 'react-icons/ai'

import './footer.css'

export const Footer = () => {
    return (
        <div className='Footer_Component Dark_Mode_Background'>
            <p className='Dark_Mode_P'>&copy;copyrights :: Mic__Dev.com ~ Blogging.com</p>
            <div className='Footer_Socials'>
                <a target="_blank" rel="noreferrer" href="https://github.com/micdev123">
                    <BsGithub className='icon' />
                </a>
                <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/michael-l-bangura-2a52a724a/">
                    <AiFillLinkedin className='icon' />
                </a>
                <a target="_blank" rel="noreferrer" href="https://twitter.com/Mic__Dev">
                    <BsTwitter className='icon' />
                </a>
                <a target="_blank" rel="noreferrer" href="https://instagram.com/mic__dev">
                    <BsInstagram className='icon' />
                </a>
            </div>
        </div>
    )
}
