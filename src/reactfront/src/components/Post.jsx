import {NavLink, useNavigate} from "react-router-dom";
import {format} from "date-fns";
import style from "../styles/forComponents/Post.module.css";
import upvote from '../assets/upvote.png';
import downvote from '../assets/downvote.png';
import axios from "axios";
import {useEffect, useState} from "react";
import * as functions from '../utils/Functions'


const Post = (post) => {

    const navigate = useNavigate();

    const [voteStatus, setVoteStatus] = useState(0);
    const [likeCount, setLikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [authorNickname, setAuthorNickname] = useState('')

    const onPostClicked = () => {
        navigate("/post/" + post.data.postId)
    }


    const getLikeCount = async () => {
        await functions.httpRequest(
            'get',
            `/getLikeCountForPost?postId=${post.data.postId}`,
            null,
            (response) => setLikeCount(response.data),
            (error) => {console.log(error)});
    }

    useEffect(() => {

        const getCommentCount = async () => {
            await functions.httpRequest(
                'get',
                `/getCommentCountForPost?postId=${post.data.postId}`,
                null,
                (response) => setCommentCount(response.data),
                (error) => {console.log(error)})
        }

        const getAuthor = async () => {
            await functions.httpRequest(
                'get',
                `/getUserById?userId=${post.data.authorId}`,
                null,
                (response) => setAuthorNickname(response.data.nickname),
                (error) => {}
            )
        }

        const getVoteStatus = async () => {
            await functions.httpAuthRequest(
                'get',
                `/getUserVote?email=${localStorage.getItem('email')}&&postId=${post.data.postId}`,
                null,
                (response) => {
                    setVoteStatus(response.data)
                },
                (error) => {}
            )
        }

        getLikeCount();
        getCommentCount();
        getAuthor()
        if (localStorage.getItem('email')) getVoteStatus()
    }, []);

    const doVote = async (e, isLike) => {
        e.stopPropagation()
        await functions.httpAuthRequest(
            'post',
            '/doVote',
            {postId: post.data.postId, isLike: isLike},
            onSuccess,
            onFail
        )

        function onSuccess(response) {
            setVoteStatus(response.data)
            getLikeCount()
        }

        function onFail(error) {
            if (error.response.status === 403) {
                alert('Login Required')
                navigate('/login')
            } else {
                alert('Error occurs while voting')
            }
        }
    }

    const content = post.data.content.length > 350 ?
        post.data.content.substring(0, 350) + "..." : post.data.content;
    return (
        <div className={style.post}>
            <button onClick={onPostClicked}>
                <div className={style.post__inner}>
                    <div className={style.post__header}>
                        <p className={style.post__author}>{authorNickname}</p>
                        <p className={style.post__date}>{format(post.data.createdDate, "MMM do, yyy h:mma")}</p>
                    </div>
                    <p className={style.post__title}>{post.data.title}</p>
                    <p className={style.post__content}>{content}</p>
                </div>
                <div className={style.post__footer}>
                    <img onClick={(e) => doVote(e, true)} className={style.post__upvote} src={upvote} alt='upvote'/>
                    <p className={style.post__likes}
                       style={{"color": (voteStatus === 0 ? "gray" : voteStatus === 1 ? "blue" : "red")}}>
                        {likeCount}
                    </p>
                    <img onClick={(e) => doVote(e, false)} className={style.post__downvote} src={downvote}
                         alt='downvote'/>
                    <p className={style.post__comments}>{commentCount} Comments</p>
                </div>
            </button>
            <div className={style.post__gradient}/>
        </div>
    );
};

export default Post;