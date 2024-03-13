package com.cy.forum.model.model

import com.cy.forum.model.request.PostEditRequest
import com.cy.forum.model.request.PostRequest
import java.math.BigInteger
import java.util.*

class Post {
    var title: String = ""
    var postId: BigInteger = BigInteger("0")
    var authorId: BigInteger = BigInteger("0")
    var content: String = ""
    var createdDate: Date = Date()
    var editedDate: Date? = Date()

    constructor(title: String, post_id: BigInteger, author_id: BigInteger, content: String, created_date: Date, edited_date:Date?) {
        this.title = title
        this.postId = post_id
        this.authorId = author_id
        this.content = content
        this.createdDate = created_date
        this.editedDate = edited_date
    }

    constructor(post: PostRequest, authorId: BigInteger) {
        title = post.title
        content = post.content;
        this.authorId = authorId
    }


    constructor(post: PostEditRequest) {
        title = post.title
        content = post.content;
        postId = post.postId
    }
}