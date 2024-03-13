package com.cy.forum.model.model

import com.cy.forum.model.request.CommentEditRequest
import com.cy.forum.model.request.CommentRequest
import java.math.BigInteger
import java.util.*

class Comment {
    var commentId: BigInteger = BigInteger("0")
    var refPostId: BigInteger = BigInteger("0")
    var refCommentId: BigInteger? = BigInteger("0")
    var authorId: BigInteger = BigInteger("0")
    var createdDate: Date = Date()
    var editedDate: Date? = Date()
    var content: String = ""
    var isDeleted: Boolean = false

    constructor(ref_post_id: BigInteger, comment_id: BigInteger,  ref_comment_id: BigInteger?, author_id: BigInteger,
        created_date: Date, edited_date: Date?, content: String, is_deleted: Boolean) {
        this.commentId = comment_id
        this.refPostId = ref_post_id
        this.refCommentId = ref_comment_id
        this.authorId = author_id
        this.createdDate = created_date
        this.editedDate = edited_date
        this.content = content
        this.isDeleted = is_deleted
    }

    constructor(comment: CommentRequest, userId: BigInteger) {
        content = comment.content;
        authorId = userId
        refPostId = comment.refPostId
        refCommentId = comment.refCommentId
    }

    constructor(comment: CommentEditRequest) {
        commentId = comment.commentId
        content = comment.content;
    }
}