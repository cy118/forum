import {NavLink, Route, Routes, useNavigate} from "react-router-dom";
import MainHeader from "../components/Header";
import Write from "./Write";
import React, {useState} from "react";
import style from "../styles/forPages/SignUp.module.css"
import axios from "axios";
import * as functions from "../utils/Functions"

function SignUp() {
    document.body.style.backgroundColor = "#ffffff"

    const navigate = useNavigate()

    const [user, setUser] = useState({
        email: '',
        password: '',
        passwordCheck: '',
        nickname: ''
    });

    const {email, password, passwordCheck, nickname} = user;

    const onChange = (event) => {
        const {value,name} = event.target;
        setUser({
            ...user,
            [name]: value,
        })
    }

    const signup = async () => {
        await functions.httpRequest(
            'post',
            "/createUser",
            user,
            onSuccess,
            onFail)

        function onSuccess(response) {
            if (response.status === 200) {
                navigate("/login")
            }
        }
        function onFail(error) {
            alert('Error occurs while sign in')
        }
    }

    return (
        <div className={style.signUp}>
            <div className={style.signUp__inner}>
                <div className={style.signUp__title}>Sign up</div>
                <div className={style.signUp__input}>
                    <input id="email" name="email" value={email} onChange={onChange} placeholder="EMAIL" maxLength="20"></input>
                </div>
                <br/>
                <div className={style.signUp__input}>
                    <input type="password" id="password" name="password" value={password} onChange={onChange} placeholder="PASSWORD" maxLength="30"></input>
                </div>
                <br/>
                <div className={style.signUp__input}>
                    <input type="password" id="passwordCheck" name="passwordCheck" value={passwordCheck} onChange={onChange} placeholder="PASSWORD CHECK"
                              maxLength="100"></input>
                </div>
                <br/>
                <div className={style.signUp__input}>
                    <input id="nickname" name="nickname" value={nickname} onChange={onChange} placeholder="NICKNAME"
                              maxLength="20"></input>
                </div>
                <div className={style.signUp__buttonArea}>
                    <button onClick={signup}>SIGN UP</button>
                </div>
            </div>
        </div>
    )

}

export default SignUp;