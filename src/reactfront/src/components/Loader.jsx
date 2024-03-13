import { NavLink } from "react-router-dom";
import style from "../styles/forComponents/Loader.module.css";

const Loader = () => {
    return (
        <div className={style.loader}>Loading...</div>
    );
};

export default Loader;