import style from "../styles/forComponents/Comment.module.css";
import {format} from "date-fns";
import React, {useEffect, useState} from "react";
import Reply from "../components/Reply";
import axios from "axios";
import postStyle from "../styles/forComponents/Post.module.css";
import upvote from "../assets/upvote.png";
import downvote from "../assets/downvote.png";
import * as functions from "../utils/Functions"
import {useNavigate} from "react-router-dom";

const Comment = (comment) => {

    const navigate = useNavigate()

    const [voteStatus, setVoteStatus] = useState(0);
    const [author, setAuthor] = useState('')
    const [isReplyActive, setIsReplyActive] = useState(false)
    const [comments, setComments] = useState([]);
    const [isReplyAdded, setIsReplyAdded] = useState(false)
    const [isLikeChanged, setIsLikeChanged] = useState(false);

    const [isMenuOpened, setIsMenuOpened] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [likeCount, setLikeCount] = useState(0);

    const [editing, setEditing] = useState({
        content: '',
        commentId: 0
    })

    const onReplyClicked = () => {
        setIsReplyActive(!isReplyActive)
    }

    const onReplyAdded = () => {
        setIsReplyAdded(!isReplyAdded)
        setIsReplyActive(false)
        comment.onReplyAdded();
    }


    const onEditCommentClicked = () => {
        setIsMenuOpened(false)
        setIsEditing(true)
    }

    const {content} = editing

    const onChange = (event) => {
        const {value,name} = event.target;
        setEditing({
            ...editing,
            [name]: value,
        })
    }

    const saveComment = async () => {
        await functions.httpAuthRequest(
            'put',
            '/editComment',
            editing,
            onSuccess,
            onFail)

        function onSuccess(response) {
            alert('Comment Saved');
            comment.data.content = editing.content
            setIsEditing(false)
        }

        function onFail(error) {
            if (error.response.status === 403) navigate('/login')
        }
    }

    const onDeleteCommentClicked = () => {
        const result = window.confirm("Are you sure you want to delete?")
        if (result) deleteComment();
    }

    const deleteComment = async () => {
        await functions.httpAuthRequest('put',
            '/deleteComment?commentId='+ comment.data.commentId,
            null,
            onSuccess,
            onFail)

        function onSuccess(response) {
            alert('Comment Deleted')
            comment.data.isDeleted = true
            setIsMenuOpened(false)
        }

        function onFail(error) {
            if (error.response.status === 403) navigate('/login')
        }
    }

    useEffect(() => {
        setEditing({commentId: comment.data.commentId, content: comment.data.content})
    }, []);

    useEffect(() => {
        const getComments = async () => {
            try {
                await functions.httpRequest(
                    'get',
                    `/getComments?postId=${comment.data.refPostId}&&commentId=${comment.data.commentId}`,
                    null,
                    onSuccess,
                    onFail
                )
            } catch (error) {
            }
        }

        function onSuccess(response) {
            setComments(response.data)
        }

        function onFail(error) {
        }

        getComments();
    }, [isReplyAdded]);


    useEffect(() => {
        const getLikeCount = async () => {
            await functions.httpRequest(
                'get',
                `/getLikeCountForComment?commentId=${comment.data.commentId}`,
                null,
                onSuccess,
                onFail
            )
        }

        function onSuccess(response) {
            setLikeCount(response.data)
        }


        function onFail(error) {
        }

        getLikeCount();
    }, [isLikeChanged]);

    useEffect(() => {
        function getAuthor() {
            functions.httpRequest(
                'get',
                `/getUserById?userId=${comment.data.authorId}`,
                null,
                (response) => {
                    setAuthor(response.data)
                },
                (error) => {}
            )
        }

        function getVoteStatus() {
            functions.httpAuthRequest(
                'get',
                `/getUserVote?email=${localStorage.getItem('email')}&&commentId=${comment.data.commentId}`,
                null,
                (response) => {
                    setVoteStatus(response.data)
                },
                (error) => {}
            )
        }

        getAuthor()
        if (localStorage.getItem('email')) getVoteStatus()
    },[])

    const doVote = async (e, isLike) => {
        e.stopPropagation()
        await functions.httpAuthRequest(
            'post',
          '/doVote',
        {commentId: comment.data.commentId, isLike: isLike},
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
        <div className={style.comment}>
            <hr className={style.comment__line}/>
            <div className={(isEditing ? style.comment__hide : '')}>
                <div>
                    <div className={style.comment__header}>
                        <p className={style.comment__author}>{author.nickname}</p>
                        <p className={style.comment__date}>{format(comment.data.createdDate, "MMM do, yyy h:mma")}</p>
                        {
                            (localStorage.getItem("email") === author.email) &&
                            <button onClick={() => setIsMenuOpened(true)}
                                className={comment.data.isDeleted ? style.comment__hide : style.comment__more}>
                            · · ·
                            </button>
                        }
                    </div>
                    <p className={style.comment__content}>
                        {(comment.data.isDeleted ? <i><font color="gray">This comment was deleted.</font></i> : comment.data.content)}
                    </p>
                </div>
                <div className={(comment.data.isDeleted ? style.comment__hide : style.comment__footer)}>
                    <img onClick={(e) => doVote(e, true)} className={style.comment__upvote} src={upvote} alt='upvote'/>
                    <p className={style.comment__likes}
                       style={{"color":(voteStatus === 0 ? "gray" : voteStatus === 1 ? "blue" : "red")}}>
                        {likeCount}
                    </p>
                    <img onClick={(e) => doVote(e, false)} className={style.comment__downvote} src={downvote} alt='downvote'/>
                    <button onClick={onReplyClicked} className={style.comment__reply}>Reply</button>
                </div>
                <div>{isReplyActive &&
                    <Reply data={{postId: comment.data.refPostId, commentId: comment.data.commentId}}
                           onReplyAdded={() => onReplyAdded()}/>}
                </div>
                <div className={(isMenuOpened ? style.comment__menu : style.comment__hide)}>
                    <button onClick={() => setIsMenuOpened(false)} style={{"color": "gray"}}>X</button>
                    <hr/>
                    <button onClick={onEditCommentClicked}>Edit</button>
                    <hr/>
                    <button onClick={onDeleteCommentClicked}>Delete</button>
                </div>
            </div>
            <div className={(isEditing ? style.comment__commentInput : style.comment__hide)}>
                <textarea id="content" name="content" value={content} onChange={onChange}
                          placeholder="What are your thoughts?"></textarea>
                <div className={style.comment__commentButton}>
                    <button onClick={()=> setIsEditing(false)} className={style.comment__cancelButton}>Cancel</button>
                    <button onClick={saveComment} className={style.comment__editButton}>Edit</button>
                </div>
            </div>
            <div className={style.comment__replies}>
                {comments.map((c, index) => (
                    <Comment data={c} onReplyAdded={comment.onReplyAdded} key={c.commentId}/>
                ))}
            </div>
        </div>
    )
}

export default Comment