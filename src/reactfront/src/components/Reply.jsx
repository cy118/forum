import style from "../styles/forComponents/Reply.module.css";
import React, {useEffect, useState} from "react";
import axios from "axios";
import * as functions from "../utils/Functions"
import {useNavigate} from "react-router-dom";

const Reply = (refData) => {

    const navigate = useNavigate()
    const [reply, setReply] = useState({
        content: '',
        refPostId: 0,
        refCommentId: 0
    })


    useEffect(() => {
        setReply({
            content: '',
            refPostId: refData.data.postId,
            refCommentId: refData.data.commentId})
    }, []);

    const {content} = reply

    const onChange = (event) => {
        const {value,name} = event.target;
        setReply({
            ...reply,
            [name]: value,
        })
    }

    const saveReply = async () => {
        await functions.httpAuthRequest(
            'post',
            '/createComment',
            reply,
            onSuccess,
            onFail)

        function onSuccess(response) {
            alert('Comment Saved');
            refData.onReplyAdded();
            setReply({refPostId: reply.refPostId, refCommentId:reply.refCommentId, content: ''})
        }

        function onFail(error) {
            if (error.response.status === 403) {
                alert('Login Required')
                navigate('/login')
            }
            else {
                alert('Error occurs while commenting')
            }
        }
    }


    return (
        <div className={style.reply__commentInput}>
            <textarea id="content" name="content" value={content} onChange={onChange}
                      placeholder="What are your thoughts?"></textarea>
            <div className={style.reply__commentButton}>
                <button onClick={saveReply}>Comment</button>
            </div>
        </div>
    )
}

export default Reply