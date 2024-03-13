package com.cy.forum.controller

import com.cy.forum.model.request.PostRequest
import com.cy.forum.model.request.PostEditRequest
import com.cy.forum.model.model.Post
import com.cy.forum.service.AuthenticationService
import com.cy.forum.service.PostService
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import java.math.BigInteger

@RestController
@Tag(name = "Post", description = "apis for posts")
class PostController {

    @Autowired
    private lateinit var postService: PostService
    @Autowired
    private lateinit var authService: AuthenticationService


    @GetMapping("/api/v1/getPosts")
    fun getPosts(@RequestParam offset: Int, @RequestParam limit: Int): List<Post> {
        return postService.getPosts(offset, limit)
    }

    @GetMapping("/api/v1/getPost")
    fun getPost(@RequestParam postId: BigInteger): Post {
        return postService.getPost(postId)
    }

    @PostMapping("/api/v1/auth/createPost")
    fun createPost(@RequestBody post: PostRequest, request : HttpServletRequest) {
        postService.createPost(post, authService.getUserByJwt(request).user_id)
    }

    @PutMapping("/api/v1/auth/editPost")
    fun editPost(@RequestBody post: PostEditRequest, request : HttpServletRequest, response: HttpServletResponse) {
        var postAuthor = postService.getPost(post.postId).authorId
        if (authService.getUserByJwt(request).user_id != postAuthor) {
            response.sendError(405, "You don't have permission.");
            return;
        }
        postService.editPost(post)
    }

    @DeleteMapping("/api/v1/auth/deletePost")
    fun deletePost(@RequestParam postId: BigInteger, request : HttpServletRequest, response: HttpServletResponse) {
        var postAuthor = postService.getPost(postId).authorId
        if (authService.getUserByJwt(request).user_id != postAuthor) {
            response.sendError(405, "You don't have permission.");
            return;
        }
        postService.deletePost(postId)
    }
}