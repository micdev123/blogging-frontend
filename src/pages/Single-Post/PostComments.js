import React, { useContext, useReducer, useRef, useState } from 'react'

import { AiFillEdit } from 'react-icons/ai'
import { Store } from '../../Store';
import { publicRequest } from '../../requestController';
import { format } from "timeago.js"


const reducer = (state, action) => {
    switch (action.type) {
        case 'CREATE_REQUEST':
            return { ...state, loadingCreate: true };
        case 'CREATE_SUCCESS':
            return {
                ...state,
                loadingCreate: false,
            };
        case 'CREATE_FAIL':
            return { ...state, loadingCreate: false };
        default:
            return state;
    }
};

export const PostComments = ({ post }) => {
    const [{ error, loadingCreate, }, dispatch, ] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const { state } = useContext(Store);
    const { userInfo } = state;
    const [commentForm, setOpenCommentForm] = useState(false);
    const [comments, setComments] = useState(post?.comments)

    const commentText = useRef()

    const HandleComment = async (e) => {
        e.preventDefault();
        const newComment = {
            commenterId: userInfo._id,
            commenterPhoto: userInfo.photo,
            commenter: userInfo.name,
            commenterFields: userInfo.fields,
            comment: commentText.current.value,
            createdAt: new Date()
        }
        try {
            dispatch({ type: 'CREATE_REQUEST' });
            const { data } = await publicRequest.post(`posts/${post._id}/postComment`, newComment);
            // console.log(data);
            setComments(data.comments)
            dispatch({ type: 'CREATE_SUCCESS' });
        } catch (error) {
            
        }
        setOpenCommentForm(false);
    }

    return (
        <div className='PostComments_Component'>
            <div className='Comment_Head Dark_Mode_Background'>
                {comments ? (<h2>Comments({comments.length})</h2>) : (<h2>Comment</h2>)}
                
                {userInfo && (
                    <button className='Comment_Btn Dark_Mode' onClick={() => setOpenCommentForm(!commentForm)}>
                        <AiFillEdit className='icon' />
                        Leave a comment
                    </button>
                )}
            </div>
            {commentForm && (
                <div className='Comment_Form Dark_Mode_Background'>
                    <div className='Form_Heading'>
                        {
                            userInfo && userInfo.photo ? (
                                <div className='Form_Heading_Img'>
                                    <img src={userInfo.photo} alt={userInfo.name} />
                                </div>
                            ) : (
                                <div className='Creator'>
                                    <h1>
                                        {userInfo.name && `${userInfo.name.substring(0, 1)}`}
                                    </h1>
                                </div>
                            )
                        }
                        
                        <p className='Form_Heading_Commenter Dark_Mode'>{userInfo.name}</p>
                    </div>
                    <form onSubmit={HandleComment}>
                        <textarea type='text' className='Comment_Form_Area' placeholder='Type something...' autoFocus={true} required ref={commentText}></textarea>
                        <div className='Form_Btns'>
                            <button type='submit' className='Create_Comment'>Submit</button>
                        </div>
                    </form>
                </div>
            )}
            <div className='Comments'>
                {comments && comments.map((comment) => (
                    <div className='Single_Comment Dark_Mode_Background' key={comment.createdAt}>
                        <div className='Commenter_Head'>
                            {
                                comment.commenterPhoto ? (
                                    <div className='Commenter_Img'>
                                        <img src={comment.commenterPhoto} alt={comment.commenter} />
                                    </div>
                                ) : (
                                    <div className='Creator'>
                                        <h1 className='Dark_Mode'>
                                            {comment.commenter && `${comment.commenter.substring(0, 1)}`}
                                        </h1>
                                    </div>
                                )
                            }
                           
                            <div className='Commenter_Info'>
                                <h2>{comment.commenter}</h2>
                                <div>
                                    <p className='Dark_Mode_P'>{comment.commenterFields}</p>
                                    <p className='Dark_Mode_P'>{format(comment.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                        <div className='Comment_Body'>
                            <p>
                                {comment.comment}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
