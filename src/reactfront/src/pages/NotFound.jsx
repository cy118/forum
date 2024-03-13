import {NavLink, Route, Routes} from "react-router-dom";
import MainHeader from "../components/Header";
import Write from "./Write";
import React from "react";
import style from "../styles/forPages/NotFound.module.css"

function NotFound() {

    document.body.style.backgroundColor = "white"

    return (
        <div className={style.notFound}>
            <h3 className={style.notFound__title}>Sorry, that page does not exist!</h3>
        </div>
    )

}

export default NotFound;