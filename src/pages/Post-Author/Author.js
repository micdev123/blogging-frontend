import React, { useEffect, useReducer, useState } from 'react'
import { MdArticle, MdDateRange, MdWorkspacesFilled } from 'react-icons/md';
import { BiCurrentLocation } from 'react-icons/bi';
import { BsFacebook, BsGithub, BsTwitter, BsYoutube } from 'react-icons/bs';
import { RiInstagramFill } from 'react-icons/ri';
import { AiOutlineLink } from 'react-icons/ai';
import { format } from "timeago.js"


import './post-author.css'
import { publicRequest } from '../../requestController';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { Article } from '../../components/Article/Article';
import { ProgressBar } from '../../components/ProgressBar';

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
            return { ...state, user_posts: action.payload, isLoading: false }; 
        case 'FETCH_FAIL':
            return { ...state, isLoading: false, error: action.payload }; 
        default:
            return state; //Current state
    }
}


export const Author = () => {
    const { url } = useParams();
    // const url = location.pathname.split("/")[1];
    // console.log(url);

    const [{ isLoading, error, user_posts }, dispatch] = useReducer(reducer, initialState);

    const [authorPosts, setAuthorPost] = useState([]);
    useEffect(() => {
        // fetch products from backend :: Ajax request
        const fetchUserAndPosts = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const { data } = await publicRequest.get(`posts/author/${url}`);
                setAuthorPost(data);
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
                
            }
            catch (error) {
                dispatch({ type: 'FETCH_FAIL', payload: error.message });
                //console.log("Failed!");
            }
        }
        // called fetchUserAndPosts() fnx
        fetchUserAndPosts();
    }, [url])
    
    return (
        isLoading ? (<ProgressBar />) : error ? (<p>{ error }</p>) : (
            <div className='Author_Component'>
                <Helmet>
                    <title>Author</title>     
                </Helmet>
                <div className='Main_Container'>
                    <div className='Author__Container'>
                        <div className='Author_Profile Dark_Mode_Background'>
                            <div className='Author_Profile_Head'>
                                {
                                    authorPosts?.user && authorPosts?.user.photo ? (
                                        <div className='Author__Img'>
                                            <img src={authorPosts?.user.photo} alt='author_img' />
                                        </div>
                                    ) : (
                                        <div className='Creator'>
                                            <h1 className='Dark_Mode'>
                                                {authorPosts.user && `${authorPosts.user.name.substring(0, 1)}`}
                                            </h1>
                                        </div>
                                    )
                                }
                                <div className='Author_Head_Content'>
                                    {authorPosts?.user && (<h2 className='Author_Name Dark_Mode'>{authorPosts?.user.name}</h2>)}
                                    
                                    <div className='Author_Fields'>
                                        <p className='Author_Field Dark_Mode_P'>{authorPosts?.user && authorPosts?.user.fields}</p>
                                    </div>
                                    
                                    <p className='Website_Link Dark_Mode_P'>
                                        <AiOutlineLink className='icon Dark_Mode_P'/>
                                        {authorPosts?.user && authorPosts?.user.userUrl}
                                    </p>
                                </div>
                            </div>
                            <div className='Author_Profile_Contents'>
                                <div className='Author_Profile_Bio'>
                                    {authorPosts.user && authorPosts.user.shortBio && (
                                        <p className='Dark_Mode_P'>{authorPosts.user.shortBio}</p>
                                    )}
                                </div>
                                <p className='Author_Date_Joined Dark_Mode_P'>
                                    <MdDateRange className='icon Dark_Mode_P' />
                                    Member Since
                                    {authorPosts.user && (
                                        <span>{format(authorPosts.user.createdAt)}</span>
                                    )}
                                </p>
                                {authorPosts?.user && authorPosts?.user.location && (
                                    <p className='Author_Location Dark_Mode_P'>
                                        <BiCurrentLocation className='icon Dark_Mode_P' />
                                        {authorPosts?.user.location}
                                    </p>
                                )}

                                {authorPosts?.user && authorPosts?.user.work && (
                                    <p className='Author_Job Dark_Mode_P'>
                                        <MdWorkspacesFilled className='icon Dark_Mode_P' />
                                        {authorPosts?.user.work}
                                    </p>
                                )}
                                
                                {authorPosts?.user && authorPosts?.user.keywords && (
                                    <div className='Author_Profile_Keywords'>
                                        {authorPosts?.user.keywords.split(', ').map((keyword) => (
                                            <Link to={`/?tag=${keyword}`} className='Keyword' key={keyword}>
                                                <p className='Dark_Mode_P'>{keyword}</p>
                                            </Link>
                                        ))}
                                    </div>
                                 )}

                                <div className='Author_Profile_Socials'>
                                    {authorPosts?.user && authorPosts?.user.websiteLink &&(
                                        <a target="_blank" rel="noreferrer" href={authorPosts?.user.websiteLink} className='Link '>
                                            <AiOutlineLink className='icon Dark_Mode_P' />
                                        </a>
                                    )}
                                    {authorPosts?.user && authorPosts?.user.gitHubLink &&(
                                        <a target="_blank" rel="noreferrer" href={authorPosts?.user.gitHubLink} className='Link Dark_Mode_P'>
                                            <BsGithub className='icon' />
                                        </a>
                                    )}
                                    {authorPosts?.user && authorPosts?.user.facebookLink &&(
                                        <a target="_blank" rel="noreferrer" href={authorPosts?.user.facebookLink} className='Link Dark_Mode_P'>
                                            <BsFacebook className='icon' />
                                        </a>
                                    )}
                                    {authorPosts?.user && authorPosts?.user.twitterLink &&(
                                        <a target="_blank" rel="noreferrer" href={authorPosts?.user.twitterLink} className='Link Dark_Mode_P'>
                                            <BsTwitter className='icon' />
                                        </a>
                                    )}
                                    {authorPosts?.user && authorPosts?.user.youtubeLink &&(
                                        <a target="_blank" rel="noreferrer" href={authorPosts?.user.youtubeLink} className='Link Dark_Mode_P'>
                                            <BsYoutube className='icon' />
                                        </a>
                                    )}
                                    {authorPosts?.user && authorPosts?.user.instagramLink &&(
                                        <a target="_blank" rel="noreferrer" href={authorPosts.user.instagramLink} className='Link Dark_Mode_P'>
                                            <RiInstagramFill className='icon' />
                                        </a>
                                    )}

                                </div>
                            </div>
                        </div>
                        <div className='Author_Works Dark_Mode_Background'>
                            <div className='Author_Works_Head'>
                                <h2 className='Dark_Mode'>
                                    <MdArticle className='icon Dark_Mode_P' />
                                    Published Work
                                </h2>
                                <p className='Dark_Mode_P'>
                                    <span>
                                        {authorPosts?.posts && authorPosts?.posts.length}
                                    </span>
                                    {authorPosts?.posts && authorPosts?.posts.length === 1 ? 'Post' : 'Posts'} published
                                </p>
                            </div>
                            <div className='Author_Work_Container'>
                                {authorPosts?.posts && authorPosts?.posts.length !== 0 && (
                                    authorPosts?.posts.map((post) => (
                                        <div className='Author_Work' key={post._id}>
                                            <Article post={post} />
                                        </div>
                                    ))
                                )}
                                
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    )
}
