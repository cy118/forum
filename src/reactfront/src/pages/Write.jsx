import {useNavigate} from "react-router-dom";
import style from "../styles/forPages/Write.module.css"
import {useEffect, useState} from 'react';
import {history} from "../components/History";
import axios from "axios";
import * as functions from "../utils/Functions"

function Write() {

    document.body.style.backgroundColor = "#dadfe6"

    const navigate = useNavigate();

    const [post, setPost] = useState({
        title: '',
        content: ''
    });

    const {title, content} = post;

    const onChange = (event) => {
        const {value,name} = event.target;
        setPost({
            ...post,
            [name]: value,
        })
    }

    const savePost = async () => {
        await functions.httpAuthRequest(
            'post',
            '/createPost',
            post,
            onSuccess,
            onFail
        )

        function onSuccess(response) {
            alert('Post Saved');
            navigate("/");
        }

        function onFail(error) {
            if (error.response.status === 403) {
                alert('Login Required')
                navigate('/login')
            } else {
                alert('Error occurs while posting')
            }
        }
    }

    const [unListen, setUnListen] = useState(() => () => {});
    useEffect(() => {
        unListen();
        const listenBackEvent = () => {
            const result = window.confirm('Are you sure you want to leave this page?')
            console.log(result)
            if (!result) {
                history.push("/write");
            }
        };

        const listenResult = history.listen(({action}) => {
            if (action === "POP") {
                listenBackEvent();
            }
        })
        setUnListen(() => () => listenResult());
    }, []);


    return (
        <div className={style.write}>
            <div className={style.write__title}>Create a Post</div>
            <div className={style.write__inner}>
                <div className={style.write__titleArea}>
                    <textarea id="title" name="title" value={title} onChange={onChange} placeholder="Title" maxLength="100"></textarea>
                </div>
                <br />
                <div className={style.write__contentArea}>
                    <textarea id="content" name="content" value={content} onChange={onChange} placeholder="Text"></textarea>
                </div>
                <div className={style.write__buttonArea}>
                    <button onClick={savePost}>Post</button>
                </div>
            </div>
        </div>
    );
}

export default Write;