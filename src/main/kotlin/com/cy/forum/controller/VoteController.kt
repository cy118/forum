package com.cy.forum.controller

import com.cy.forum.model.request.VoteRequest
import com.cy.forum.service.AuthenticationService
import com.cy.forum.service.UserService
import com.cy.forum.service.VoteService
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.servlet.http.HttpServletRequest
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import java.math.BigInteger

@RestController
@Tag(name = "Vote", description = "apis for votes")
class VoteController {

    @Autowired
    private lateinit var voteService: VoteService
    @Autowired
    private lateinit var authService: AuthenticationService
    @Autowired
    private lateinit var userService: UserService

    @GetMapping("/api/v1/getLikeCountForPost")
    fun getLikeCountForPost(@RequestParam postId: BigInteger): Int {
        return voteService.getLikeCountForPost(postId)
    }

    @GetMapping("/api/v1/getLikeCountForComment")
    fun getLikeCountForComment(@RequestParam commentId: BigInteger): Int {
        return voteService.getLikeCountForComment(commentId)
    }

    @GetMapping("/api/v1/auth/getUserVote")
    fun getUserVote(@RequestParam email: String, @RequestParam postId: BigInteger?, @RequestParam commentId: BigInteger?): Int {
        return voteService.getUserVote(userService.getUserByEmail(email)!!.user_id, postId, commentId)
    }

    @PostMapping("/api/v1/auth/doVote")
    fun doVote(@RequestBody vote: VoteRequest, request : HttpServletRequest): Int {
        return voteService.doVote(vote, authService.getUserByJwt(request).user_id)
    }
}