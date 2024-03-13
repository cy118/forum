import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import style from "../styles/forPages/Write.module.css";
import {history} from "../components/History";
import * as functions from "../utils/Functions"

function Edit() {
    document.body.style.backgroundColor = "#dadfe6"

    const params = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState({
        postId: 0,
        title: '',
        content: ''
    });

    const {title, content} = post;


    useEffect(() => {
        const getPost = async () => {
            await functions.httpRequest(
                'get',
                `/getPost?postId=${params.postId}`,
                null,
                onSuccess,
                onFail);
        };

        function onSuccess(response) {
            setPost(response.data);
        }

        function onFail(error) {
            console.log(error);
        }

        getPost();
    }, [])


    const onChange = (event) => {
        const {value,name} = event.target;
        setPost({
            ...post,
            [name]: value,
        })
    }

    const savePost = async () => {
        await functions.httpAuthRequest(
            'put',
            '/editPost',
            post,
            onSuccess,
            onFail)


        function onSuccess(response) {
            alert('Post Saved');
            navigate("/post/" + post.postId);
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
                history.push("/edit/"+ params.postId);
            }
        };

        const listenResult = history.listen(({action}) => {
            if (action === "POP") {
                listenBackEvent();
            }
        })
        setUnListen(() => () => listenResult());
        return listenResult;
    }, []);


    return (
        <div className={style.write}>
            <div className={style.write__title}>Edit a Post</div>
            <div className={style.write__inner}>
                <div className={style.write__titleArea}>
                    <textarea id="title" name="title" value={title} onChange={onChange} placeholder="Title" maxLength="100"></textarea>
                </div>
                <br />
                <div className={style.write__contentArea}>
                    <textarea id="content" name="content" value={content} onChange={onChange} placeholder="Text"></textarea>
                </div>
                <div className={style.write__buttonArea}>
                    <button onClick={savePost}>Edit</button>
                </div>
            </div>
        </div>
    );
}

export default Edit;