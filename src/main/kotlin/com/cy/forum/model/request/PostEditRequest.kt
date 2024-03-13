package com.cy.forum.model.request

import java.math.BigInteger

data class PostEditRequest (
    val postId: BigInteger,
    val title: String,
    val content: String,
)