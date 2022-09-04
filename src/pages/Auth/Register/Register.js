import React, { useContext, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Store } from '../../../Store';
import { publicRequest } from '../../../requestController';
import { getError } from '../../../utils';
import { Icon } from 'react-icons-kit'
import {eye} from 'react-icons-kit/feather/eye'
import { eyeOff } from 'react-icons-kit/feather/eyeOff'

export const Register = () => {
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

    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmedPasswordRef = useRef()

    // console.log(name, email, password);

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;

    const submitHandler = async (e) => {
        e.preventDefault();
            if (passwordRef.current.value !== confirmedPasswordRef.current.value) {
            setMsg('Passwords do not match');
            return;
        }
        try {
            const { data } = await publicRequest.post('/auth/signup', {
                name: nameRef.current.value,
                password: passwordRef.current.value,
                email: emailRef.current.value,
                userUrl: emailRef.current.value.split('@')[0]
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
    }, [navigate, redirect, userInfo]);


    return (
        <div className='Auth_Component'>
            <div className='Main_Container'>
                <Helmet>
                    <title>Register</title>     
                </Helmet>
                <div className='Auth_Container'>
                    <form className='Auth_Form Dark_Mode_Background' onSubmit={submitHandler}>
                        {msg && (<p className='msg'>{msg}</p>)}
                        <h2 className='Dark_Mode'>Create An Account</h2>
                        <input type='text' name='name' placeholder='Enter full name' required ref={nameRef} className="Dark_Mode_Background" />
                        <input type='email' name='email' placeholder='Enter email' required ref={emailRef} className="Dark_Mode_Background" />
                        <div className='Password'>
                            <input type={type} name='password' placeholder='Enter password' required ref={passwordRef} className="Dark_Mode_Background" />
                            <span onClick={handleToggle} className='ShowPassword'><Icon icon={icon} className='icon' /></span>
                        </div>
                        <input type='password' name='confirm_password' placeholder='confirm password' ref={confirmedPasswordRef}  required className="Dark_Mode_Background" />
                        <button type='submit' className='Auth_Btn'>Register</button>
                        
                        <button className='Info'>
                            <Link to={`/login?redirect=${redirect}`} className='link'>
                                Already have an account | <span>Login</span>
                            </Link>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
