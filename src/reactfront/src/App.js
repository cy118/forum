import './styles/App.css';
import React from 'react';
import MainHeader from "./components/Header";
import Write from "./pages/Write";
import Login from "./pages/Login";
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import Thread from "./pages/Thread";
import Edit from "./pages/Edit";
import Admin from "./pages/Admin";
import UserInfo from "./pages/UserInfo";

function App() {
    return (
        <div>
            <MainHeader/>
            <main>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/post/:postId" element={<Thread/>}/>
                    <Route path="/write" element={<Write/>}/>
                    <Route path="/edit/:postId" element={<Edit/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<SignUp/>} />
                    <Route path="/userinfo" element={<UserInfo/>}/>
                    <Route path="/admin" element={<Admin/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </main>
        </div>
    )

}

export default App;
