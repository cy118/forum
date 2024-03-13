package com.cy.forum.model.model

import com.cy.forum.model.request.VoteRequest
import java.math.BigInteger


class Vote {
    var voteId: BigInteger = BigInteger("0")
    var postId: BigInteger? = BigInteger("0")
    var commentId: BigInteger? = BigInteger("0")
    var isLike: Boolean = false
    var userId: BigInteger = BigInteger("0")

    constructor(vote: VoteRequest, userId: BigInteger) {
        postId = vote.postId
        commentId = vote.commentId
        isLike = vote.isLike
        this.userId = userId
    }

    constructor(
        vote_id: BigInteger,
        post_id: BigInteger?,
        comment_id: BigInteger?,
        is_like: Boolean,
        user_id: BigInteger,
    ) {
        this.voteId = vote_id
        this.postId = post_id
        this.commentId = comment_id
        this.isLike = is_like
        this.userId = user_id
    }
}