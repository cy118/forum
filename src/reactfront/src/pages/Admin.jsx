import {useParams} from "react-router-dom";
import style from "../styles/forPages/Admin.module.css";
import axios from "axios";
import {useEffect, useState} from "react";


const Admin = () => {
    return (
        <div className={style.admin}>
            Admin Page
        </div>
    )
}

export default Admin