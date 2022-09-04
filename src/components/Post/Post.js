import React, { useEffect, useReducer, useState } from 'react'
import { BiDislike, BiLike } from 'react-icons/bi'
import { FaRegComment } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { format } from "timeago.js"
import { publicRequest } from '../../requestController'
// import { Store } from '../../Store'

import './post.css'


const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                singlePost: action.payload.singlePost,
                loading: false
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true };
        case 'UPDATE_SUCCESS':
            return { ...state, post: action.payload, loadingUpdate: false };
        case 'UPDATE_FAIL':
            return { ...state, loadingUpdate: false };
        default:
            return state;
    }
};


export const Post = ({ data }) => {
    const id = data._id

    const [{ loadingUpdate, }, dispatch] = useReducer(reducer, {
       loadingUpdate: false,
    });
    
    const [likes, setLikes] = useState(null)
    const [likeState, setLikeState] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await publicRequest.get(`posts/find/${id}`);
                setLikes(data.likeCount);
                dispatch({ type: 'FETCH_SUCCESS', payload: data  });
            }
            catch (err) {
            }
        };
        fetchData();
    }, [id]);
    
    const likePost = async (id) => {
        dispatch({ type: 'UPDATE_REQUEST' });
        await publicRequest.put(`posts/${id}/likePost`);
        setLikes(likes + 1)
        dispatch({ type: 'UPDATE_SUCCESS', });
        setLikeState(false);
        
    }
    const unLikePost = async (id) => {
        dispatch({ type: 'UPDATE_REQUEST' });
        await publicRequest.put(`posts/${id}/unLikePost`);
        setLikes(likes - 1)
        dispatch({ type: 'UPDATE_SUCCESS', });
        setLikeState(true);
    }
    return (
        <div className='Post_Component Dark_Mode_Background' key={data?._id}>
            <div className='Post_Contents'>
                <p className='Small_Screen_Date Dark_Mode_P'>{format(data?.createdAt)}</p>
                <div className='Post_Contents_Head'>
                    {
                        data?.creatorPhoto ? (
                            <div className='Post_Head_Left'>
                                <img src={data.creatorPhoto} alt={data.creator} />
                            </div>
                        ) : (
                            <div className='Creator'>
                                <h1 className='Dark_Mode'>
                                    {data?.creator && `${data?.creator.substring(0, 1)}`}
                                </h1>
                            </div>
                        )
                    }
                        
                    <div className='Post_Head_Right'>
                        <Link to={`/${data?.creatorLink}`} className='Link'>
                            <h2 className='Dark_Mode'>{data?.creator}</h2>
                        </Link>
                        <div className='Post_Head_Right_Foot_'>
                            <Link to={`/${data?.creatorLink}`} className='Link'>
                                <p className='Dark_Mode_P'>{data?.creatorLink}</p>
                            </Link>
                            <div className='line Dark_Mode'></div>
                            <p className='Date Dark_Mode_P'>{format(data?.createdAt)}</p>
                        </div>
                    </div>
                </div>
                <div className='Post_Contents_Body'>
                    <Link to={`/post/${data?.slug}_${data?._id}`} className='Link'>
                        <h2 className='Post_Contents_Body_Title Dark_Mode'>
                            {data?.title}
                        </h2>
                        <p className='Post_Contents_Body_Desc Dark_Mode_P'>
                            {data?.desc && `${data.desc.substring(0, 200)}...`}
                        </p>
                    </Link>
                    <div className='Post_Contents_Body_Tags'>
                        {data?.tags.split(',').map((tag) => (
                            <Link to={`/?tag=${tag}`} key={tag} className='Tag'>
                                <p className='Dark_Mode_P'>{tag}</p>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className='Post_Contents_Foot'>
                    <p className='Dark_Mode_P'>{data?.duration} min read</p>
                    <div className='line Line Dark_Mode_P'></div>
                    <p className='info Dark_Mode_P'>
                        {likeState && (
                            <BiLike className='icon Dark_Mode_P' onClick={() => likePost(data?._id)} />
                        )}
                        
                        {!likeState && (
                            <BiDislike className='icon Dark_Mode_P' onClick={() => unLikePost(data?._id)} />
                        )}
                        
                        {likes}
                    </p>
                    <p className='info comment Dark_Mode_P'>
                        <FaRegComment className='icon' />
                        {data?.comments.length}
                    </p>
                </div>
            </div>
            <div className='Post_Image'>
                <img src={data.photo} alt='Post_Img' />
            </div>
        </div>
    )
}
