package com.cy.forum.model.request

import java.math.BigInteger

data class VoteRequest (
    val postId: BigInteger?,
    val commentId: BigInteger?,
    val isLike: Boolean,
)