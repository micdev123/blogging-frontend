import React, { useContext, useReducer, useRef, useState } from 'react'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { Helmet } from 'react-helmet-async';
import { BiMessageSquareAdd } from 'react-icons/bi';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { MdPublish } from 'react-icons/md';


import { Store } from '../../Store';

import './write.css'
import { publicRequest } from '../../requestController';
import { useNavigate } from 'react-router';

import app from '../../firebase';


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


export const Write = () => {
    const navigate = useNavigate();
    const { state } = useContext(Store);
    const { userInfo } = state;

    const [{ error, loadingCreate, }, dispatch, ] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const [openFormSideBar, setFormSideBar] = useState(false);
    
    const closeFormSideBar = () => {
        setFormSideBar(false);
    }
    
    
    const titleRef = useRef();
    const slugRef = useRef();
    const tagsRef = useRef();
    const descRef = useRef();
    const durationRef = useRef();
    const userLinkRef = useRef();
    const [file, setFile] = useState("")
   
    const submitHandler = (e) => {
        e.preventDefault();
        const newPost = {
            title: titleRef.current.value,
            slug: slugRef.current.value,
            desc: descRef.current.value,
            tags: tagsRef.current.value,
            duration: durationRef.current.value,
            creatorId: userInfo._id,
            creator: userInfo.name,
            creatorPhoto: userInfo.photo,
            creatorLink: userInfo.userUrl
        }

        const img_name = new Date().getTime() + file.name;
        const storage = getStorage(app);
        const storageRef = ref(storage, img_name);

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            console.log('Upload is ' + progress + '% done');
            }, 
            (error) => {
                // Handle unsuccessful uploads
            }, 
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    const post = { ...newPost, photo: downloadURL };
                    create(post);
                });
            }
        );

    }

    const create = async (newPost) => {
        // const { product_ } = product
        // console.log(product);
        try {
            dispatch({ type: 'CREATE_REQUEST' });
            await publicRequest.post("posts", newPost);
            dispatch({ type: 'CREATE_SUCCESS' });
            navigate(`/`);
        }
        catch (err) {
            dispatch({ type: 'CREATE_FAIL',});
        }
    }
    return (
        <div className={!openFormSideBar ? 'Write_Component' : 'Set_Fixed Dark_Mode_Background'}>
            <div className={!openFormSideBar ? 'Display_None' : 'Overlay_Form_Post'}></div>
            <Helmet>
                <title>Write</title>   
            </Helmet>
            <div className='Main_Container'>
                <div className='Write_Container Dark_Mode_Background'>
                    {file && (
                        <img className="Write_Img" src={URL.createObjectURL(file)} alt="Post_Img" />
                    )}
                
                    <form className='Write_Form_Container ' onSubmit={submitHandler}>
                        <div className='Form_Group'>
                            <label htmlFor='File_Input'>
                                <BiMessageSquareAdd className='icon' />
                            </label>
                            <input type='file' id='File_Input' style={{ display: "none" }} onChange={(e) => setFile(e.target.files[0])} />
                            <input type='text' placeholder='Title' className='Text_Input Dark_Mode_Background' autoFocus={true} required ref={titleRef} />
                        </div>
                        <div className='Form_Group Dark_Mode_Background'>
                            <textarea placeholder='Tell your story...' type='text' className='Text_Input Textarea Dark_Mode_Background' name='desc' required ref={descRef}></textarea>
                        </div>
                        <p onClick={() => setFormSideBar(!openFormSideBar)} className='Publish'>
                            Publish
                        </p>
                        {openFormSideBar && (
                            <div className='Form_SideBar Dark_Mode_Background'>
                                <AiOutlineCloseCircle className='CloseBtn' onClick={closeFormSideBar}/>
                                <div className='SideBar_Form_Group'>
                                    <label htmlFor='keywords' className='Dark_Mode'>SEO Title | Slug</label>
                                    <input type='text' placeholder='key-to-blogging' className='Input Dark_Mode_P' name='slug' required ref={slugRef} />
                                    <p className='Dark_Mode_P'>Please separate each word with hyphen(-) with no spacing</p>
                                </div>
                                <div className='SideBar_Form_Group'>
                                    <label htmlFor='keywords' className='Dark_Mode'>Post Keywords | Tags</label>
                                    <input type='text' placeholder='technology,javaScript,etc...' className='Input Dark_Mode_P' name='tags' required ref={tagsRef} />
                                    <p>Please separate each word with a comma(,) with no spacing</p>
                                </div>
                                <div className='SideBar_Form_Group'>
                                    <label htmlFor='duration' className='Dark_Mode'>Duration</label>
                                    <input type='number' placeholder='2 min, 35 min, etc...' className='Input Dark_Mode_P' name='duration' required ref={durationRef} />
                                    <p>Please only the number</p>
                                </div>
                                <div className='SideBar_Form_Group'>
                                    <label htmlFor='keywords' className='Dark_Mode'>Publish post on</label>
                                    <input type='text' name='creatorLink' value={userInfo.userUrl} className='Input Dark_Mode_P' required ref={userLinkRef} />
                                </div>
                                {loadingCreate ? (
                                    <button type='submit' className='Now_Publish' >
                                        Processing...
                                    </button>
                                ): (
                                    <button type='submit' className='Now_Publish' >
                                        <MdPublish className='icon'/>
                                        Publish
                                    </button>    
                                )}
                            </div>
                        )}
                    </form>
                    <p onClick={() => setFormSideBar(!openFormSideBar)} className='Mobile_Publish'>
                        Publish
                    </p>
                </div>
            </div>
        </div>
    )
}
