import React, { useEffect, useReducer } from 'react'
import { publicRequest } from '../../requestController';
import { Article } from '../Article/Article';

import './related-post.css'
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
            return { ...state, posts: action.payload, isLoading: false }; 
        case 'FETCH_FAIL':
            return { ...state, isLoading: false, error: action.payload }; 
        default:
            return state; //Current state
    }
}

export const RelatedPost = ({ post }) => {
    const [{ isLoading, error, posts}, dispatch] = useReducer(reducer, initialState); 
    // const [posts, setPosts] = useState([])
    useEffect(() => {
        // fetch products from backend :: Ajax request
        const fetchPosts = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                if(post) {
                    const { data } = await publicRequest.get(`posts/?tag=${post?.tags.split(',')[0]}`);
                    // setPosts(data);
                    dispatch({ type: 'FETCH_SUCCESS', payload: data });
                }
            }
            catch (error) {
                dispatch({ type: 'FETCH_FAIL', payload: error.message });
                //console.log("Failed!");
            }
        }
        // called fetchProducts() fnx
        fetchPosts();
    }, [post])
    // console.log(posts);
    
    return (
        isLoading ? (<div>Loading...</div>) : error ? (<p>{error}</p>) : (
            posts.posts && posts?.posts.length > 1 && (
                <div className='Related_Post_Component Dark_Mode_Background'>
                    <h2>You might also like:</h2>
                    <div className='Articles'>
                        {posts.posts && posts.posts.filter(({ _id }) => _id !== post._id).map((post_) => (
                            <div className='Article' key={post_._id}>
                                <Article post={post_} />
                            </div>
                        ))}

                    </div>
                </div>
            )
        )
    )
}
