package com.cy.forum.controller

import com.cy.forum.model.request.CommentRequest
import com.cy.forum.model.request.CommentEditRequest
import com.cy.forum.model.model.Comment
import com.cy.forum.service.AuthenticationService
import com.cy.forum.service.CommentService
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import java.math.BigInteger

@RestController
@Tag(name = "Comment", description = "apis for comments")
class CommentController {

    @Autowired
    private lateinit var commentService: CommentService
    @Autowired
    private lateinit var authService: AuthenticationService

    @GetMapping("/api/v1/getComments")
    fun getComments(@RequestParam postId: BigInteger, @RequestParam commentId: BigInteger): List<Comment> {
        return commentService.getComments(postId, commentId)
    }

    @PostMapping("/api/v1/auth/createComment")
    fun createComment(@RequestBody comment: CommentRequest, request : HttpServletRequest) {
        commentService.createComment(comment, authService.getUserByJwt(request).user_id)
    }

    @PutMapping("/api/v1/auth/editComment")
    fun editComment(@RequestBody comment: CommentEditRequest, request: HttpServletRequest, response: HttpServletResponse) {
        var commentAuthor = commentService.getComment(comment.commentId).authorId
        if (authService.getUserByJwt(request).user_id != commentAuthor) {
            response.sendError(405, "You don't have permission.");
            return;
        }
        commentService.editComment(comment)
    }

    @PutMapping("/api/v1/auth/deleteComment")
    fun deleteComment(@RequestParam commentId: BigInteger, request: HttpServletRequest, response: HttpServletResponse) {
        var commentAuthor = commentService.getComment(commentId).authorId
        if (authService.getUserByJwt(request).user_id != commentAuthor) {
            response.sendError(405, "You don't have permission.");
            return;
        }
        commentService.deleteComment(commentId)
    }

    @GetMapping("/api/v1/getCommentCountForPost")
    fun getCommentCountForPost(@RequestParam postId: BigInteger): Int {
        return commentService.getCommentCountForPost(postId)
    }
}