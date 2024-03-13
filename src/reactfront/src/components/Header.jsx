import {NavLink, useLocation, useNavigate} from "react-router-dom";
import style from "../styles/forComponents/Header.module.css";
import {useEffect, useState} from "react";
import * as functions from "../utils/Functions"

const MainHeader = () => {

    const location = useLocation()
    const navigate = useNavigate()

    const [nickname, setNickname] = useState(null)

    useEffect(() => {
         functions.httpRequest('get',
            `/getUser?email=${localStorage.getItem('email')}`,
            null,
            onSuccess,
            onFail
            )

        function onSuccess(response) {
            setNickname(response.data.nickname)
        }

        function onFail(error) {

        }
    }, [])

    const toHome = () => {
        if (location.pathname.includes('write') || location.pathname.includes('edit')) {
            const result = window.confirm('Are you sure you want to leave this page?')
            if (result) {
                navigate("/")
            }
        }
        else if (location.pathname === '/') {
            window.location.reload()
        }
        else {
            navigate("/")
        }
    }

    return (
        <header className={style.header}>
            <div className={style.header__inner}>
                <h3 className={style.header__title}>
                    <button onClick={toHome}>FORUM</button>
                </h3>
                <nav className={style.header__nav}>
                    {
                        (nickname != null) &&
                        <ul>
                            <li>
                                <NavLink to="/write"> Create Post </NavLink>
                            </li>
                            <li>
                                <NavLink to="/userinfo"> {nickname} </NavLink>
                            </li>
                        </ul>
                    }
                    {
                        (nickname == null) &&
                        <ul>
                            <li>
                                <NavLink to="/login"> Log In </NavLink>
                            </li>
                        </ul>
                    }

                </nav>
            </div>
        </header>
    );
};

export default MainHeader;