import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { publicRequest } from '../../requestController';

import './category.css'

export const Category = () => {
    const [tags, setTags] = useState([]);

    useEffect(() => {
        const getTags = async () => {
            const { data } = await publicRequest.get("posts/tags");
            setTags(data);
        };
        getTags();
    }, []);
    
    const values = Object.values(tags)
    
    const postTags = [];
    values.forEach((item) => {
        item.forEach((object) => {
            //  console.log(object);
            for (let i in object) {
                // console.log(object[i]);
                for (var j in object[i]) {
                    // console.log(object[i][j]._id);
                    postTags.push(object[i][j]._id)
               }
            }
         });
    });
    // console.log(tags);
    // console.log(postTags.join(','));
    const joinTags = postTags.join(',')
    const Tags = joinTags.split(',')
    const uniqueTags = Tags.filter((x, i, a) => a.indexOf(x) === i)
    // console.log(uniqueTags)
    return (
        <div className='Category_Component'>
            {uniqueTags && uniqueTags.map((tag) => (
                <Link to={`/?tag=${tag}`} key={tag} className='Tag'>
                    <p>{tag}</p>
                </Link>  
            ))}
        </div>
    )
}
