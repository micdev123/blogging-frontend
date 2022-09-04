import React, { useContext, useReducer } from 'react'
import { CgProfile } from 'react-icons/cg';
import { AiFillDelete, AiFillSetting } from 'react-icons/ai';


import './setting-sidebar.css'
import { Link, useNavigate } from 'react-router-dom';
import { MdArticle } from 'react-icons/md';
import { publicRequest } from '../../requestController';
import { Store } from '../../Store';

const reducer = (state, action) => {
    switch (action.type) {
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


export const SettingSideBar = () => {
    const { state } = useContext(Store);
    const { userInfo } = state;

    const [{ loadingDelete, successDelete }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });
    const deleteHandler = async () => {
        if (window.confirm('Are you sure to delete?')) {
            try {
                await publicRequest.delete(`users/${userInfo._id}`);
                dispatch({ type: 'DELETE_SUCCESS' });
                localStorage.removeItem('userInfo');
                window.location.href = '/register';
            }
            catch (err) {
                dispatch({ type: 'DELETE_FAIL', });
            }
        }
    };
    return (
        <div className='Setting_SideBar_Component Dark_Mode_Background'>
            <h2>
                <AiFillSetting className='icon'/>
                Settings
            </h2>
            <ul className='Settings_Links'>
                <Link to={`/settings`} className='Link Dark_Mode'>
                    <CgProfile className='icon' />
                    Profile
                </Link>
                <Link to="/myBlogs" className='Link Dark_Mode'>
                    <MdArticle className='icon' />
                    Articles
                </Link>
                <li className='Link Dark_Mode' onClick={deleteHandler}>
                    <AiFillDelete className='icon trash' />
                    Delete Account
                </li>
            </ul>
        </div>
    )
}
