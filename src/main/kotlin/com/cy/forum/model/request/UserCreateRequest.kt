package com.cy.forum.model.request

data class UserCreateRequest (
    val email: String,
    val password: String,
    val passwordCheck: String,
    val nickname: String
)