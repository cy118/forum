package com.cy.forum.service

import com.cy.forum.mapper.CommentMapper
import com.cy.forum.model.request.CommentRequest
import com.cy.forum.model.request.CommentEditRequest
import com.cy.forum.model.model.Comment
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.math.BigInteger

@Service
class CommentService {

    @Autowired
    private lateinit var commentMapper: CommentMapper

    fun getComment(commentId: BigInteger): Comment {
        return commentMapper.getComment(commentId)
    }
    fun getComments(postId: BigInteger, commentId: BigInteger): List<Comment> {
        return commentMapper.getComments(postId, commentId)
    }

    fun createComment(comment: CommentRequest, userId: BigInteger) {
        commentMapper.createComment(Comment(comment, userId))
    }

    fun editComment(comment: CommentEditRequest) {
        commentMapper.editComment(Comment(comment))
    }

    fun deleteComment(commentId: BigInteger) {
        commentMapper.deleteComment(commentId)
    }

    fun getCommentCountForPost(postId: BigInteger) : Int {
        return commentMapper.getCommentCountForPost(postId)
    }
}