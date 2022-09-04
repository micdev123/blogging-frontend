import React, { useContext, useEffect, useReducer, useState } from 'react'
import { AuthorRightSide } from '../../components/Author-Right-Side/AuthorRightSide'


import { AiFillEdit, AiFillDelete } from 'react-icons/ai'

import { HiCubeTransparent } from 'react-icons/hi'

import './single-post.css'
import { RelatedPost } from '../../components/Related-Post/RelatedPost'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { publicRequest } from '../../requestController';
import { format } from "timeago.js"
import { Store } from '../../Store';
import { RightSideCategory } from '../../components/Right-Side-Category/RightSideCategory'
import { Helmet } from 'react-helmet-async'
import { PostComments } from './PostComments'
import { ProgressBar } from '../../components/ProgressBar'



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


export const SinglePost = () => {
    const navigate = useNavigate();
    
    
    const { state } = useContext(Store);
    const { userInfo } = state;

    const location = useLocation();
    const slug = location.pathname.split("/")[2];

    const id = slug.split("_")[1];
    // console.log(id);

    const [{ isLoading, error, singlePost, loadingDelete, successDelete, }, dispatch] = useReducer(reducer, initialState);

    const [post, setPost] = useState([]);
    

    useEffect(() => {
        const fetchPost = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const { data } = await publicRequest.get(`posts/find/${id}`);
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
    }, [id, successDelete])

    // console.log(post);

    const [rightBar, setRightBar] = useState(false);

    // const close_rightBar = () => {
    //     setRightBar(false);
    // }

    const deleteHandler = async () => {
        if (window.confirm('Are you sure to delete?')) {
            try {
                await publicRequest.delete(`posts/${id}`, {
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
        <div className={!rightBar ? 'Single_Post_Component' : 'Set_Fixed'}>
            {loadingDelete && (<ProgressBar />)}
            {isLoading ? (<ProgressBar />) : error ? (<div>{error}</div>) : (
                <>
                    <Helmet>
                        <title>{post.title}</title>
                    </Helmet>
                    <div className={!rightBar ? 'Display_None' : 'Overlay_Single_Post'}></div>
                    <div className='Main_Container'>
                        <div className='Single_Post_Container'>
                            <div className='Single_Post_Left'>
                                <div className='Single_Post Dark_Mode_Background'>
                                    <div className='Single_Post_Img'>
                                        <img src={post.photo} alt='Single_Post_Img' />
                                    </div>
                                    <div className='Single_Post_Left_Contents'>
                                        <div className='Small_Screen'>
                                            <p className='Small_Screen_Date Dark_Mode_P'>{format(post?.createdAt)}</p>
                                            {userInfo && post?.creatorId === userInfo?._id && (
                                                <div className='Single_Post_Actions'>
                                                    <AiFillEdit className='icon edit' onClick={() => navigate(`/updatePost/${post?._id}`)} />
                                                    <AiFillDelete className='icon trash' onClick={deleteHandler} />
                                                </div>
                                            )}
                                        </div>
                                        <div className='Single_Post_Left_Head'>
                                            {
                                                post?.creatorPhoto ? (
                                                    <div className='Post_Head_Left'>
                                                        <img src={post?.creatorPhoto} alt={post.creator} />
                                                    </div>
                                                ) : (
                                                    <div className='Creator'>
                                                        <h1 className='Dark_Mode'>
                                                            {post?.creator && `${post?.creator.substring(0, 1)}`}
                                                        </h1>
                                                    </div>
                                                )
                                            }
                                            <div className='Post_Head_Right'>
                                                <Link to={`/${post?.creatorLink}`} className='Link'>
                                                    <h2 className='Dark_Mode'>{post?.creator}</h2>
                                                </Link>
                                                <div className='Post_Head_Right_Foot'>
                                                    <div className='Foot_Left'>
                                                        <Link to={`/${post?.creatorLink}`} className='Link'>
                                                            <p className='Dark_Mode_P'>{post?.creatorLink}</p>
                                                        </Link>
                                                        
                                                        <div className='line'></div>
                                                        <p className='Date Dark_Mode_P'>{format(post?.createdAt)}</p>
                                                    </div>
                                                    {userInfo && post?.creatorId === userInfo?._id && (
                                                        <div className='Single_Post_Actions'>
                                                            <AiFillEdit className='icon edit' onClick={() => navigate(`/updatePost/${post?._id}`)} />
                                                            <AiFillDelete className='icon trash' onClick={deleteHandler} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <h2 className='Single_Post_Title Dark_Mode'>
                                            {post?.title}
                                        </h2>
                                        <div className='Single_Post_Body'>
                                            <p className='Dark_Mode'>
                                                {post?.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className='RecommendedPost'>
                                    <RelatedPost post={post} />
                                </div>
                                <div className='Single_Post_Left_Footer'>
                                    <div className='Single_Comments'>
                                        <PostComments post={post} /> 
                                    </div>
                                </div>
                            </div>
                            
                            <div className='Single_Post_Right'>
                                <div className='Single_Post_Author'>
                                    <AuthorRightSide author={post} />
                                    <div className='Categories_ Dark_Mode_Background'>
                                        <h2>Categories</h2>
                                        <div className='Category'>
                                            <RightSideCategory />
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>

                            <div className='Right_Sidebar_Icon'>
                                <HiCubeTransparent className='icon' onClick={(e) => setRightBar(!rightBar)} />
                            </div>

                            {rightBar && (
                                <div className='Single_Post_Right_Small_Screen Dark_Mode_Background'>
                                    <div className='Single_Post_Author'>
                                        <AuthorRightSide author={post}  />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
        
    )
}
