import {useParams, useNavigate} from "react-router-dom";
import {format} from "date-fns";
import style from "../styles/forPages/Thread.module.css";
import postStyle from "../styles/forComponents/Post.module.css"
import React, {useCallback, useEffect, useRef, useState} from "react";
import axios from "axios";
import Comment from "../components/Comment";
import edit from "./Edit";
import upvote from "../assets/upvote.png";
import downvote from "../assets/downvote.png";
import * as functions from "../utils/Functions"


const Thread = () => {

    document.body.style.backgroundColor = "#dadfe6"

    const navigate = useNavigate();

    const params = useParams();
    const postId = params.postId;

    const [post, setPost] = useState({
        postId: 0,
        authorId: 0,
        createdDate: new Date(),
        title: '',
        content: ''
    });

    const [voteStatus, setVoteStatus] = useState(0);
    const [author, setAuthor] = useState('')
    const [comments, setComments] = useState([]);
    const [isCommentAdded, setIsCommentAdded] = useState(false)
    const [isLikeChanged, setIsLikeChanged] = useState(false);

    const [comment, setComment] = useState({
        content: '',
        refPostId: 0
    })

    const {content} = comment

    const [isMenuOpened, setIsMenuOpened] = useState(false);

    const [likeCount, setLikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);


    useEffect(() => {
        const getPost = async () => {
            await functions.httpRequest(
                'get',
                    `/getPost?postId=${postId}`,
                null,
                onSuccess,
                onFail
            );
        };

        function onSuccess(response) {
            setPost(response.data);
            setComment({refPostId: Number(postId), content:''})
            getAuthor(response.data.authorId);
        }

        function onFail(error) {
            console.log(error);
        }


        function getAuthor(authorId) {
             functions.httpRequest(
                'get',
                `/getUserById?userId=${authorId}`,
                null,
                (response) => setAuthor(response.data),
                (error) => {}
            )
        }


        function getVoteStatus() {
            functions.httpAuthRequest(
                'get',
                `/getUserVote?email=${localStorage.getItem('email')}&&postId=${postId}`,
                null,
                (response) => {
                    setVoteStatus(response.data)
                },
                (error) => {}
            )
        }

        getPost();
        if (localStorage.getItem('email')) getVoteStatus()
    }, [])

    useEffect(() => {
        const getComments = async () => {
             await functions.httpRequest(
             'get',
             `/getComments?postId=${postId}&&commentId=0`,
             null,
             onSuccess,
             onFail)
        }

        function onSuccess(response) {
            setComments(response.data)
        }

        function onFail(error) {
            console.log(error);
        }

        getComments();

    }, [isCommentAdded]);

    const onChange = (event) => {
        const {value,name} = event.target;
        setComment({
            ...comment,
            [name]: value,
        })
    }

    const saveComment = async () => {
        await functions.httpAuthRequest(
            'post',
            '/createComment',
            comment,
            onSuccess,
            onFail)

        function onSuccess(response) {
            alert('Comment Saved');
            setIsCommentAdded(!isCommentAdded)
            setComment({refPostId: comment.refPostId, content: ''})
            setCommentCount(commentCount+1);
        }

        function onFail(error) {
            if (error.response.status === 403) {
                alert('Login Required')
                navigate('/login')
            } else {
                alert('Error occurs while commenting')
            }
        }
    }

    const onEditPostClicked = () => {
        navigate("/edit/" + postId)
    }

    const onDeletePostClicked = () => {
        const result = window.confirm("Are you sure you want to delete?")
        if (result) deletePost();
    }

    const deletePost = async () => {
        await functions.httpAuthRequest(
            'delete',
            '/deletePost?postId='+ postId,
            null,
            onSuccess,
            onFail)

        function onSuccess(response) {
            alert('Post Deleted')
            navigate("/")
        }

        function onFail(error) {
            console.log(error)
            if (error.response.status === 403) navigate('/login')
        }
    }

    useEffect(() => {
        const getCommentCount = async () => {
            await functions.httpRequest(
                'get',
                `/getCommentCountForPost?postId=${params.postId}`,
                null,
                onSuccess,
                onFail)
        }

        function onSuccess(response) {
            setCommentCount(response.data)
        }

        function onFail(error) {
            console.log(error);
        }
        getCommentCount();
    }, [isCommentAdded]);

    useEffect(() => {
        const getLikeCount = async () => {
            await functions.httpRequest(
                'get',
                `/getLikeCountForPost?postId=${params.postId}`,
                null,
                onSuccess,
                onFail)
        }

        function onSuccess(response) {
            setLikeCount(response.data)
        }

        function onFail(error) {
            console.log(error);
        }

        getLikeCount();
    }, [isLikeChanged]);

    const doVote = async (e, isLike) => {
        e.stopPropagation()
        await functions.httpAuthRequest(
            'post',
            '/doVote',
            {postId: post.postId, isLike: isLike},
            onSuccess,
            onFail
        )

        function onSuccess(response) {
            setIsLikeChanged(!isLikeChanged)
            setVoteStatus(response.data)
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

    return (
        <div className={style.thread}>
            <div className={style.post}>
                <div className={style.post__inner}>
                    <div className={postStyle.post__header}>
                        <p className={postStyle.post__author}>{author.nickname}</p>
                        <p className={postStyle.post__date}>{format(post.createdDate, "MMM do, yyy h:mma")}</p>
                        {
                            (localStorage.getItem("email") === author.email) &&
                            <button onClick={() => setIsMenuOpened(true)} className={style.thread__more}>· · ·</button>
                        }
                    </div>
                    <p className={postStyle.post__title}>{post.title}</p>
                    <p className={postStyle.post__content}>{post.content}</p>
                </div>
                <div className={postStyle.post__footer}>
                    <img onClick={(e) => doVote(e, true)} className={postStyle.post__upvote} src={upvote} alt='upvote'/>
                    <p className={postStyle.post__likes}
                       style={{"color":(voteStatus === 0 ? "gray" : voteStatus === 1 ? "blue" : "red")}}>
                           {likeCount}
                    </p>
                    <img onClick={(e) => doVote(e, false)} className={postStyle.post__downvote} src={downvote} alt='downvote'/>
                    <p className={postStyle.post__comments}>{commentCount} Comments</p>
                </div>
                <div className={style.thread__commentInput}>
                    <textarea id="content" name="content" value={content} onChange={onChange}
                              placeholder="What are your thoughts?"></textarea>
                    <div className={style.thread__commentButton}>
                        <button onClick={saveComment}>Comment</button>
                    </div>
                </div>

                <hr className={style.thread__divideLine}/>
                <div className={style.thread__comments}>
                    {comments.map((comment, index) => (
                        <Comment data={comment} onReplyAdded={()=>setIsCommentAdded(!isCommentAdded)} key={comment.commentId} />
                    ))}
                </div>
            </div>
            <div className={(isMenuOpened ? style.thread__menu : style.thread__menuHide)}>
                <button onClick={() => setIsMenuOpened(false)} style={{"color":"gray"}}>X</button>
                <hr />
                <button onClick={onEditPostClicked}>Edit</button>
                <hr />
                <button onClick={onDeletePostClicked}>Delete</button>
            </div>
        </div>
    );
};

export default Thread;