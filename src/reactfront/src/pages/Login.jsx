import {NavLink, Route, Routes, useNavigate} from "react-router-dom";
import MainHeader from "../components/Header";
import Write from "./Write";
import React, {useEffect, useState} from "react";
import style from "../styles/forPages/Login.module.css"
import axios from "axios";
import * as functions from "../utils/Functions"
import cookie from 'js-cookie'

function Login() {
    document.body.style.backgroundColor = "#ffffff"

    const navigate = useNavigate()

    const [user, setUser] = useState({
        email: '',
        password: ''
    });
    const [haveError, setHaveError] = useState(false)

    const {email, password} = user;

    const onChange = (event) => {
        const {value,name} = event.target;
        setUser({
            ...user,
            [name]: value,
        })
        setHaveError(false)
    }

    useEffect(() => {
        localStorage.removeItem("access_token")
        localStorage.removeItem("email")
    }, []);

    const login = async () => {
        await functions.httpRequest(
            'post',
            "/login",
            user,
            onSuccess,
            onFail
        )

        function onSuccess(response) {
            navigate("/")
            localStorage.setItem("access_token", response.data.token)
            localStorage.setItem("email", user.email)
            window.location.reload()
        }

        function onFail(error) {
            alert('Error occurs while login')
            setHaveError(true)
        }
    }

    return (
        <div className={style.login}>
            <div className={style.login__inner}>
                <div className={style.login__title}>Log in</div>
                <div className={style.login__input}>
                    <input id="email" name="email" value={email} onChange={onChange} placeholder="EMAIL"
                              maxLength="100"></input>
                </div>
                <br/>
                <div className={style.login__input}>
                    <input type="password" id="password" name="password" value={password} onChange={onChange} placeholder="PASSWORD"
                              maxLength="100"></input>
                </div>
                {
                    haveError &&
                    <div className={style.login__loginError}>Invalid email/password combination</div>
                }
                <div className={style.login__buttonArea} onClick={login}>
                    <button>LOG IN</button>
                </div>
                <NavLink to="/signup" className={style.login__signUpButton}>SIGN UP</NavLink>
            </div>
        </div>
    )

}

export default Login;