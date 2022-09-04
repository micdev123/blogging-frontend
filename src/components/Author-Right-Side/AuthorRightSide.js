import React, { useEffect, useReducer, useState } from 'react'
import { BsTwitter, BsGithub, BsYoutube, BsFacebook } from 'react-icons/bs'

import { publicRequest } from '../../requestController';
import { Link } from 'react-router-dom'

import './author-right-side.css'
import { AiOutlineLink } from 'react-icons/ai';
import { RiInstagramFill } from 'react-icons/ri';
import { ProgressBar } from '../ProgressBar';

const initialState = {
    posts: [],
    loading: true,
    error: '',
};


// product reducer to manage product state
const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, isLoading: true };
        case 'FETCH_SUCCESS':
            return { ...state, posts_: action.payload, isLoading: false }; 
        case 'FETCH_FAIL':
            return { ...state, isLoading: false, error: action.payload }; 
        default:
            return state; //Current state
    }
}

export const AuthorRightSide = ({ author }) => {
    const userId = author.creatorId
    const [{ isLoading, error, posts_ }, dispatch] = useReducer(reducer, initialState);

    const [user, setUser] = useState({});

    useEffect(() => {
        const fetchUser = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const { data } = await publicRequest.get(`/users/find/${userId}`);
                setUser(data);
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            }
            catch (err) {
                // console.log('Not Found');
            }
        };
        fetchUser();
    }, [userId]);
    // console.log(user);
    return (
        isLoading ? (<ProgressBar />) : error ? (<p>{ error }</p>) : (
            <div className='Author_RightSide_Component Dark_Mode_Background'>
                {
                    user.photo ? (
                        <div className='Author_RightSide_Img'>
                            <img src={user.photo} alt={user.name} />
                        </div>
                    ) : (
                        <div className='Creator'>
                            <h1>
                                {user.name && `${user.name.substring(0, 1)}`}
                            </h1>
                        </div>
                    )
                }
                <div className='Author_RightSide_Title'>
                    <h2 className='Dark_Mode'>{user.name}</h2>
                    {user.fields &&  (<p className='Author_Fields Dark_Mode_P'>{user.fields}</p>)}
                </div>
                {user.shortBio && (<p className='Author_RightSide_Desc Dark_Mode_P'>{user.shortBio}</p>)}
                <div className='Author_RightSide_socials'>
                    {user && user.websiteLink &&(
                        <a target="_blank" rel="noreferrer" href={user.websiteLink} className='Link Dark_Mode'>
                            <AiOutlineLink className='icon' />
                        </a>
                    )}
                    {user && user.gitHubLink &&(
                        <a target="_blank" rel="noreferrer" href={user.gitHubLink} className='Link Dark_Mode'>
                            <BsGithub className='icon' />
                        </a>
                    )}
                    {user && user.facebookLink &&(
                        <a target="_blank" rel="noreferrer" href={user.facebookLink} className='Link Dark_Mode'>
                            <BsFacebook className='icon' />
                        </a>
                    )}
                    {user && user.twitterLink &&(
                        <a target="_blank" rel="noreferrer" href={user.twitterLink} className='Link Dark_Mode'>
                            <BsTwitter className='icon' />
                        </a>
                    )}
                    {user && user.youtubeLink &&(
                        <a target="_blank" rel="noreferrer" href={user.youtubeLink} className='Link Dark_Mode'>
                            <BsYoutube className='icon' />
                        </a>
                    )}
                    {user && user.instagramLink &&(
                        <a target="_blank" rel="noreferrer" href={user.instagramLink} className='Link Dark_Mode'>
                            <RiInstagramFill className='icon' />
                        </a>
                    )}
                </div>

                <Link to={`/${user.userUrl}`} className='Author_RightSide_btn'>
                    View work
                </Link>
            </div>
        )
    )
}
