import React, { useContext, useState, createContext } from 'react'
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MdArrowDropDown, MdArticle } from 'react-icons/md'
import { BsFillPenFill } from 'react-icons/bs'
import { AiFillSetting } from 'react-icons/ai';
import { RiLogoutCircleLine } from 'react-icons/ri';
import { CgMenuHotdog } from 'react-icons/cg';
import { Link } from 'react-router-dom'
import { Store } from './Store';
import ReactSwitch from "react-switch";
import { Footer } from './components/Footer/Footer';
import { Login } from './pages/Auth/Login/Login';
import { Register } from './pages/Auth/Register/Register';
import ProtectedRoute from './components/ProtectedRoutes';
import { Author } from './pages/Post-Author/Author';
import { Home } from './pages/Home/Home';
import { Settings } from './pages/Settings/Settings';
import { SinglePost } from './pages/Single-Post/SinglePost';
import { Write } from './pages/Write/Write';
import { EditSinglePost } from './pages/Edit-Post/EditSinglePost';
import { MyArticles } from './pages/My-Articles/MyArticles'

// import ReactSwitch from "react-switch";


export const ThemeContext = createContext(null);

function App() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [dropdown, setDropdown] = useState(false);
  const [Menu, setMenu] = useState(false);

  const signOutHandler = () => {
      ctxDispatch({ type: 'USER_SIGNOUT' });
      localStorage.removeItem('userInfo');
    window.location.href = '/';
      // setMenu(false)
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="App_Container" id={theme}>
        <BrowserRouter>
          <div className='Nav_Container Dark_Mode_Background'>
            <div className='navigation'>
              <Link to='/' className='logo Dark_Mode'>
                <MdArticle className='icon' />
                Blogging
              </Link>
              <ul className='navLinks'>
                {userInfo ? (
                    <div className='LoginUser'>
                        {userInfo.photo ?
                            <div className='UserPhoto'>
                                <img src={userInfo.photo} alt='user' />
                            </div>
                            :
                            <div className='UserLogo'>
                                <h1 className='Dark_Mode'>
                                    {userInfo.name && `${userInfo.name.substring(0, 1)}`}
                                </h1>
                            </div>
                        }
                        <div className='DropDown'>
                            <p className='User'>
                                {userInfo.name}
                                <MdArrowDropDown className='icon' onClick={(e) => setDropdown(!dropdown)} />
                            </p>
                            <MdArrowDropDown className='icon BigScreen ' onClick={(e) => setDropdown(!dropdown)} />
                            {dropdown &&
                                (
                                    <div className='Dropdown_Menu'>
                                        <Link to='/settings' className='Link' onClick={(e) => setDropdown(false)}>
                                            <AiFillSetting className='icon' />
                                            Setting
                                        </Link>
                                        <Link to='/' className='Link Logout' onClick={signOutHandler}>
                                            <RiLogoutCircleLine className='icon'/>
                                            Logout
                                        </Link>
                                    </div>
                                )
                            }      
                        </div>
                    </div>
                ) : (
                    <Link to='/login' className='navLink state Dark_Mode'>
                      <p>Hello, Guest</p>
                      <p>Sign-In</p>
                    </Link>
                )

                }
                <Link to='/write' className='navLink Write Dark_Mode'>
                  <p>
                    <BsFillPenFill className='icon'/>
                    Write
                  </p> 
                </Link>
                <p className='Switch'>
                  {/* <label> {theme === "light" ? "Light Mode" : "Dark Mode"}</label> */}
                  <ReactSwitch onChange={toggleTheme} checked={theme === "dark"} />
                </p> 
              </ul>
              {Menu && (
                <div className='Mobile_NavLinks'>
                  <div className='Mobile_NavLinks_Head'>
                    <p className='Switch'>
                      {/* <label> {theme === "light" ? "Light Mode" : "Dark Mode"}</label> */}
                      <ReactSwitch onChange={toggleTheme} checked={theme === "dark"} />
                    </p>
                    <CgMenuHotdog className='Close_Btn' onClick={() => setMenu(!Menu)}/>
                  </div>
                  <div className='Mobile_NavLink_User'>
                    {!userInfo ?
                      (
                        <Link to='/login' className='navLink state' onClick={() => setMenu(false)}>
                          <p>Hello, Guest</p>
                          <p>Sign-In</p>
                        </Link>
                      ) : (
                        <div className='LoginUser'>
                          {userInfo.photo ?
                            <div className='UserPhoto'>
                                <img src={userInfo.photo} alt='user' />
                            </div>
                            :
                            <div className='UserLogo_'>
                                <h1 className='Dark_Mode'>
                                    {userInfo.name && `${userInfo.name.substring(0, 1)}`}
                                </h1>
                            </div>
                          }
                        </div>
                      )
                    }
                  </div>
                  <Link to='/write' className='navLink Write Dark_Mode' onClick={() => setMenu(false)}>
                    <p>
                      <BsFillPenFill className='icon'/>
                      Write
                    </p> 
                  </Link>
                  {userInfo && (
                    <div className='User_Menu__'>
                      <Link to='/settings' className='Link' onClick={() => setMenu(false)}>
                        <AiFillSetting className='icon' />
                        Setting
                      </Link>
                      <Link to='/' className='Link Logout' onClick={signOutHandler}>
                        <RiLogoutCircleLine className='icon'/>
                        Logout
                      </Link>
                    </div>
                  )}
                  
                </div>
              )} 
              <CgMenuHotdog className='Menu_Btn' onClick={() => setMenu(!Menu)}/>
            </div>
          </div>
          <main className={Menu && "Set_Fixed Overlay"} onClick={() => setMenu(false)}>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/post/:id" element={<SinglePost />} />
              <Route path="/updatePost/:id" element={<EditSinglePost />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/write"
                element={
                  <ProtectedRoute>
                    <Write />
                  </ProtectedRoute>}
              />
              <Route path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route path="/myBlogs"
                element={
                  <ProtectedRoute>
                    <MyArticles />
                  </ProtectedRoute>
                }
              />
              <Route path="/:url" element={<Author />} />
              
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
