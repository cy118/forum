package com.cy.forum.model.request

import java.math.BigInteger

data class CommentRequest (
    val content: String,
    val refPostId: BigInteger,
    val refCommentId: BigInteger?,
)