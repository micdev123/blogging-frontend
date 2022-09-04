import React, { useContext, useEffect, useReducer, useState } from 'react'

import { SettingSideBar } from '../../components/Setting-Sidebar/SettingSideBar'


import './my-articles.css'
import { Store } from '../../Store';
import { useNavigate } from 'react-router';
import { publicRequest } from '../../requestController';
import { Link } from 'react-router-dom';
import { format } from 'timeago.js';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { MdArticle } from 'react-icons/md';
import { ProgressBar } from '../../components/ProgressBar';


const initialState = {
    post: [],
    loading: true,
    error: '',
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, isLoading: true };
        case 'FETCH_SUCCESS':
            return { ...state, singlePost: action.payload.singlePost, isLoading: false }; 
        case 'FETCH_FAIL':
            return { ...state, isLoading: false, error: action.payload };
        case 'DELETE_REQUEST':
            return { ...state, loadingDelete: true, successDelete: false };
        case 'DELETE_SUCCESS':
            return {
                ...state,
                loadingDelete: false,
                successDelete: true,
            };
        case 'DELETE_FAIL':
            return { ...state, loadingDelete: false, successDelete: false };

        case 'DELETE_RESET':
            return { ...state, loadingDelete: false, successDelete: false };
        default:
            return state; //Current state
    }
}


export const MyArticles = () => {
    const navigate = useNavigate();

    const { state } = useContext(Store);
    const { userInfo } = state;
    const [{ isLoading, error, singlePost, loadingDelete, successDelete, }, dispatch] = useReducer(reducer, initialState);

    const [posts, setPost] = useState([]);
    

    useEffect(() => {
        const fetchPost = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const { data } = await publicRequest.get(`posts/mine/${userInfo._id}`);
                setPost(data);
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            }
            catch (error) {
                dispatch({ type: 'FETCH_FAIL', payload: error.message });
            }
        }
        if (successDelete) {
            dispatch({ type: 'DELETE_RESET' });
        }
        else {
            fetchPost();
        }
    }, [userInfo, successDelete])

    const deleteHandler = async (post) => {
        if (window.confirm('Are you sure to delete?')) {
            try {
                await publicRequest.delete(`posts/${post._id}`, {
                    data: { creator: userInfo.name },
                });
                dispatch({ type: 'DELETE_SUCCESS' });
                navigate(`/`);
            }
            catch (err) {
                dispatch({ type: 'DELETE_FAIL', });
            }
        }
    };
    
    return (
        isLoading ? (<ProgressBar />) : error ? (<p>{error}</p>) : (
            <div className='My_Articles_Component'>
                <div className='Main_Container'>
                    <div className='My_Articles_Container Dark_Mode_Background'>
                        <SettingSideBar />
                        <div className='My_Articles Dark_Mode_Background'>
                            <h2>
                                <MdArticle className='icon'/>
                                My articles
                            </h2>
                            <div className='Articles_Container'>
                                {posts && posts?.map((post) => (
                                    <div className='My_Posts' key={post._id}>
                                        <div className='Article_Image'>
                                            <img src={post?.photo} alt='Post_Img' />
                                        </div>
                                        <div className='Author_Article_Contents'>
                                            <div className='Author_Article_contents_Heading'>
                                                <p className='Author_Article_Date Dark_Mode_P'>{format(post?.createdAt)}</p>
                                                {userInfo && post?.creatorId === userInfo?._id && (
                                                    <div className='Single_Post_Actions'>
                                                        <AiFillEdit className='icon edit' onClick={() => navigate(`/updatePost/${post?._id}`)} />
                                                        <AiFillDelete className='icon trash' onClick={() => deleteHandler(post)} />
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className='Article_Contents_Body'>
                                                <Link to={`/post/${post?.slug}_${post?._id}`} className='Link'>
                                                    <h2 className='Article_Contents_Body_Title Dark_Mode'>
                                                        {post?.title}
                                                    </h2>
                                                    <h2 className='Small_Screen_Post_Title Dark_Mode'>
                                                        {post?.title.length > 50 ? `${post.title.substring(0, 45)}...` : post?.title}
                                                    </h2>
                                                    <p className='Article_Contents_Body_Desc Dark_Mode_P'>
                                                        {post?.desc && `${post.desc.substring(0, 220)}...`}
                                                    </p>
                                                </Link>
                                            </div> 
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    )
}
