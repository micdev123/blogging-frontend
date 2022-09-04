import React, { useEffect, useReducer } from 'react'
import { Link } from 'react-router-dom';
import { format } from 'timeago.js';
import { publicRequest } from '../../requestController';
import { ProgressBar } from '../ProgressBar';

import './most-read.css'


const initialState = {
    posts: [],
    loading: true,
    error: '',
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, isLoading: true };
        case 'FETCH_SUCCESS':
            return { ...state, posts: action.payload, isLoading: false }; 
        case 'FETCH_FAIL':
            return { ...state, isLoading: false, error: action.payload }; 
        default:
            return state; //Current state
    }
}



export const MostRead = () => {
    const [{ isLoading, error, posts }, dispatch] = useReducer(reducer, initialState); 
     useEffect(() => {
        // fetch products from backend :: Ajax request
        const fetchPosts = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const { data } = await publicRequest.get("posts/limit");
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
                // setProduct(data);
            }
            catch (error) {
                dispatch({ type: 'FETCH_FAIL', payload: error.message });
                //console.log("Failed!");
            }
        }
        // called fetchProducts() fnx
        fetchPosts();
    }, [])
    // console.log(posts);
    return (
        isLoading ? (<ProgressBar />) : error ? (<p>{ error }</p>) : (
            <div className='Most_Read_Component Dark_Mode_Background'>
                <h2 className='Dark_Mode'>Trending</h2>
                <div className='Trending_Posts'>
                    {posts && posts?.map((post) => (
                        <Link to={`/post/${post?.slug}_${post?._id}`} key={post?._id} className='Trending_Post Dark_Mode'>
                            <div className='Trending_Post_Img'>
                                <img src={post?.photo} alt='Article_Img' />
                            </div>
                            <div className='Trending_Post_Content'>
                                <h2 className='Dark_Mode'>{post?.title.length > 20 ? `${post?.title.substring(0, 50)}...` : post.title }</h2>
                                <p className='Creator_Date Dark_Mode_P'>{post?.creator} | <span>{format(post?.createdAt)}</span></p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        )
    )
}
