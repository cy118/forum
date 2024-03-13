import logo from '../assets/logo.svg';
import '../styles/App.css';
import {useEffect, useMemo, useState} from 'react';
import React from 'react';
import {CompactTable} from '@table-library/react-table-library/compact';
import {useTheme} from '@table-library/react-table-library/theme';
import {getTheme} from '@table-library/react-table-library/baseline';
import {Table} from '@table-library/react-table-library';



function TestApp() {

    // const [message, setMessage] = useState([]);

    // useEffect(() => {
    // fetch(url, options) : Http 요청 함수
    // fetch('/test')
    //     .then(response => response.text())
    //     .then(message => {
    //       setMessage(message);
    //     });
    // }, [])
    //
    // return (
    //     <div className='App'>
    //       <header className='App-header'>
    //         <img src={logo} className='App-logo' alt='logo' />
    //         <p>
    //           message is {message}
    //         </p>
    //       </header>
    //     </div>
    // );

    const [post, setPost] = useState([]);

    useEffect(() => {
        fetch('/postList')
            .then(response => response.json())
            .then(data => {
                setPost(data);
            })
    }, []);

    console.log(post)

    // return (
    //     <ul>
    //         {post.map((data) => (
    //             <li key={data.post_id}>
    //                 <p>{data.title}</p>
    //                 <p>{data.author_id}</p>
    //                 <p>{data.created_date}</p>
    //                 <p>{data.edited_date}</p>
    //             </li>
    //         ))}
    //     </ul>
    // )

    const COLUMNS = [
        { label: 'Title', renderCell: (item) => item.title },
        { label: 'Author', renderCell: (item) => item.author_id },
        {
            label: 'CreatedDate',
            renderCell: (item) =>
                new Date(item.created_date).toLocaleDateString('en-US', {
                    // new Date(2024, 2, 7).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                }),
        },
        {
            label: 'EditedDate',
            renderCell: (item) =>
                new Date(item.edited_date).toLocaleDateString('en-US', {
                    //new Date(2024, 2, 7).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                }),
        },
    ];

    // const columns = [
    //         {
    //             accessor: 'title',
    //             Header: 'Title',
    //         },
    //         {
    //             accessor: 'author_id',
    //             Header: 'Author',
    //         },
    //         {
    //             accessor: 'created_date',
    //             Header: 'CreatedDate',
    //         },
    //         {
    //             accessor: 'edited_date',
    //             Header: 'EditedDate'
    //         }
    //     ]

    // const postData = React.useMemo(
    //     () =>
    //         post.map((p) => ({
    //             title: p.title,
    //             author: p.author_id,
    //             createdDate: p.created_date,
    //             editedDate: p.edited_date
    //         })),
    //     []
    // );

    // const postData = React.useMemo(
    //     () =>
    //         Array(2)
    //             .fill()
    //             .map(() => ({
    //             title: post.title,
    //             author: post.author_id,
    //             createdDate: post.created_date,
    //             editedDate: post.edited_date
    //         })),
    //     []
    // );

    const theme = useTheme(getTheme());

    const data = {nodes: post};
    //return <CompactTable columns={COLUMNS} data={data}>{(tableList) => null}</CompactTable>
    return <CompactTable columns={COLUMNS} data={data} theme={theme} />

    // const data = useMemo(
    //     () =>
    //         rawData
    //             .map((v, idx) => ({
    //                 title: v.title,
    //                 author: v.author,
    //                 createdDate: v.createdDate,
    //                 editedDate: v.editedDate
    //             })),
    //     []
    // );

    // return (
    //     <div className='App'>
    //         <header className='App-header'>
    //         <img src={logo} className='App-logo' alt='logo'/>
    //         <p>
    //         message is {post}
    //         </p>
    //         </header>
    //     </div>
    // );
    // return <Table columns={columns} data={postData}/>;
}

export default TestApp;
