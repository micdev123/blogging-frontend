import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'timeago.js';

import './article.css'


export const Article = ({ post }) => {
    return (
        <div className='Article_Component'>
            <div className='Article_Image'>
                <Link to={`/post/${post.slug}_${post._id}`}>
                    <img src={post.photo} alt='' />
                </Link>
            </div>
            <div className='Author_Article_Contents'>
                <p className='Author_Article_Date Dark_Mode_P'>{format(post.createdAt)}</p>
                <div className='Author_Article_Contents_Head'>
                    {post.creatorPhoto ? (
                        <div className='Article_Head_Left'>
                            <img src={post.creatorPhoto} alt='Author_Img' />
                        </div>
                        ) : (
                            <div className='Creator_'>
                                <h1 className='Dark_Mode'>
                                    {post.creator && `${post.creator.substring(0, 1)}`}
                                </h1>
                            </div>
                        )
                    }
                    <div className='Article_Head_Right'>
                        <div className='Article_Head_Right_Foot'>
                            <Link to={`/${post.creatorLink}`} className='Link'>
                                <h2 className='Dark_Mode'>{post.creator}</h2>
                            </Link>
                            <Link to={`/${post.creatorLink}`} className='Link'>
                                <p className='Dark_Mode_P'>{post.creatorLink}</p>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='Article_Contents_Body'>
                    <Link to={`/post/${post.slug}_${post._id}`} className='Link'>
                        <h2 className='Article_Contents_Body_Title Dark_Mode'>
                            {post.title}
                        </h2>
                        <h2 className='Small_Screen_Post_Title Dark_Mode'>
                            {post?.title.length > 50 ? `${post.title.substring(0, 45)}...` : post?.title}
                        </h2>
                        <p className='Article_Contents_Body_Desc Dark_Mode_P'>
                            {post.desc && `${post.desc.substring(0, 220)}...`}
                        </p>
                    </Link>
                </div> 
            </div>
        </div>
    )
}
