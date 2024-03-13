package com.cy.forum.model.request

import java.math.BigInteger

data class CommentEditRequest (
    val content: String,
    val commentId: BigInteger
)