import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { publicRequest } from '../../../requestController';
import { Store } from '../../../Store';
import { getError } from '../../../utils';
import { Icon } from 'react-icons-kit'
import {eye} from 'react-icons-kit/feather/eye'
import { eyeOff } from 'react-icons-kit/feather/eyeOff'

import '../auth.css'


export const Login = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const [type, setType]=useState('password');
    const [icon, setIcon] = useState(eyeOff)
    const handleToggle=()=>{    
        if(type==='password'){
            setIcon(eye);      
            setType('text');
        }
        else{
            setIcon(eyeOff);     
            setType('password');
        }
    }

    const [msg, setMsg] = useState('');
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await publicRequest.post('/auth/sign-in', {
                email,
                password,
            });
            // when dispatching you need to set the type and the payload 
            ctxDispatch({ type: 'USER_SIGNIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate(redirect || '/');
        }
        catch (err) {
            setMsg(getError(err));
        }
    }
    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo])

    return (
        <div className='Auth_Component'>
            <Helmet>
                <title>Login</title>     
            </Helmet>
            <div className='Main_Container'>
                <div className='Auth_Container'>
                    <form onSubmit={submitHandler} className='Auth_Form Dark_Mode_Background'>
                        {msg && (<p className='msg'>{msg}</p>)}
                        <h2 className='Dark_Mode'>Login To Your Account</h2>
                        <input type='email' name='email' placeholder='Enter email' required onChange={(e) => setEmail(e.target.value)} className="Dark_Mode_Background" />
                        <div className='Password'>
                            <input type={type} name='password' placeholder='Enter password' required onChange={(e) => setPassword(e.target.value)} className="Dark_Mode_Background" />
                            <span onClick={handleToggle} className='ShowPassword'><Icon icon={icon} className='icon' /></span>
                        </div>
                        <button type='submit' className='Auth_Btn'>Login</button>
                        
                        <button className='Info'>
                            <Link to={`/register?redirect=${redirect}`} className='link'>
                                Don't have an account | <span>Register</span>
                            </Link>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

