import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Post from "../components/Post";
import Loader from "../components/Loader";
import style from "../styles/forPages/Home.module.css"
import *  as functions from "../utils/Functions"

const Home = () => {

    document.body.style.backgroundColor = "#dadfe6"

    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [index, setIndex] = useState(1);
    const loaderRef = useRef(null);
    const [isFinished, setIsFinished] = useState(false);

    const fetchData = useCallback(async () => {
        // console.log("fetch " + index + isLoading)
        if (isLoading || isFinished) return;

        // console.log("offset = " + index*2 + " limit = 3")
        setIsLoading(true);
        await functions.httpRequest(
            'get',
            `/getPosts?offset=${index*2}&limit=3`,
            null,
            onSuccess,
            onFail)

        onFinished()
        function onFinished() {
            setIndex((prevIndex) => prevIndex + 1);
            setIsLoading(false);
        }

        function onSuccess(res) {
            const allPosts = posts;
            // console.log(res.data)
            // console.log("prev" + allPosts)
            res.data.map((post) => {
                if (!allPosts.some(p => p.postId === post.postId)) allPosts.push(post)
            })
            setPosts(allPosts);
            if (res.data.length < 3) setIsFinished(true);
            // onFinished()
        }

        function onFail(error) {
            setIsFinished(true)
            // onFinished()
        }
    }, [index, isLoading]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const target = entries[0];
            if (target.isIntersecting) {
                fetchData();
            }
        });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [fetchData]);

    useEffect(() => {
        const getData = async () => {
            setIndex(1)
            setIsLoading(true);

            await functions.httpRequest('get', '/getPosts?offset=0&limit=3', null,
                (response) => {
                    // console.log("offset=0, limit=3")
                    // console.log(response.data)
                    setPosts(response.data)
                    if (response.data.length < 3) setIsFinished(true)
                    else setIsFinished(false)
                    setIsLoading(false);
                }, (error) => {
                    console.log(error)
                    setIsLoading(false);
                } );

        };

        getData();
    }, []);

    // console.log(posts)

    return (
        <div className={style.home}>
            {posts.map((item, index) => (
                <Post data={item} key={item.postId} />
            ))}
            <div ref={loaderRef}>{isLoading && <Loader />}</div>
        </div>
    );
}

export default Home;
