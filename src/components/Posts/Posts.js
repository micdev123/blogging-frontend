import React, { useEffect, useReducer, useState } from 'react'
import { TbError404Off } from 'react-icons/tb'
import { MostRead } from '../Most-Read-Posts/MostRead'
import { Post } from '../Post/Post'
import { publicRequest } from '../../requestController';

import './posts.css'
import { Link, useLocation } from 'react-router-dom';
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

export const Posts = () => {
    const { search } = useLocation();

    const [{ isLoading, error, posts_ }, dispatch] = useReducer(reducer, initialState); 
    const [posts, setPosts] = useState()
    useEffect(() => {
        // fetch products from backend :: Ajax request
        const fetchPosts = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const { data } = await publicRequest.get("posts" + search);
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
                setPosts(data);
            }
            catch (error) {
                dispatch({ type: 'FETCH_FAIL', payload: error.message });
                //console.log("Failed!");
            }
        }
        // called fetchProducts() fnx
        fetchPosts();
    }, [search])
    // console.log(posts);
    return (
        isLoading ? (<ProgressBar/>) : error ? (<p>{ error }</p>) : (
        <div className='Posts_Component'>
            <div className='Posts'>
                {posts && posts.length !== 0 ?
                    (
                        posts.posts.map((post) => (
                            <Post data={post} key={post._id} />
                        ))
                    ) : (
                        <p className='Post_Error'>
                            <TbError404Off className='icon'/>
                            No Post with this keyword
                        </p>
                    )
                    }
                    <div className='Pagination'>
                        {posts && [...Array(posts.pages).keys()].map((x) => (
                            <Link
                                className={x + 1 === Number(posts.page) ? 'Link Active_Link Dark_Mode' : 'Link Dark_Mode'}
                                key={x + 1} to={`/?page=${x + 1}`}
                            >
                                {x + 1}
                            </Link>
                        ))}
                    </div>
            </div>
            <div className='Most_Viewed'>
                <MostRead />
            </div>
            </div>
        )
    )
}
