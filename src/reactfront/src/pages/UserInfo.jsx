import {NavLink, useNavigate, useParams} from "react-router-dom";
import style from "../styles/forPages/UserInfo.module.css";
import axios from "axios";
import React, {useEffect, useState} from "react";
import * as functions from "../utils/Functions"




const UserInfo = () => {

    const navigate = useNavigate();

    document.body.style.backgroundColor = "#dadfe6"

    const [user, setUser] = useState({
        userId: 0,
        email: '',
        nickname: '',
        role: ''
    })

    useEffect(() => {
        const getUser = async () => {
            await functions.httpRequest(
                'get',
                `/getUser?email=${localStorage.getItem("email")}`,
                null,
                onSuccess,
                onFail)

            function onSuccess(response) {
                setUser(response.data);
            }

            function onFail(error) {
            }
        };

        getUser()
    }, []);

    const logout = () => {
        functions.httpAuthRequest(
            'post',
            `/logout?email=${localStorage.getItem("email")}`,
            null,
            onSuccess,
            onFail
        )

        function onSuccess(response) {
            if (response.data) {
                localStorage.removeItem("email")
                navigate("/")
                window.location.reload()
            }
        }

        function onFail(error) {

        }
    }

    return (<div className={style.userInfo}>
            <div className={style.userInfo__inner}>
                <div className={style.userInfo__title}>My Info</div>
                <div className={style.userInfo__info}> Id: {user.email} </div>
                <div className={style.userInfo__info}> Nickname: {user.nickname}</div>
                <div className={style.userInfo__buttonArea} onClick={logout}>
                    <button>LOG OUT</button>
                </div>
            </div>
        </div>
    )
}

export default UserInfo