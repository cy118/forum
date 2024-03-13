package com.cy.forum.common.exception

import io.jsonwebtoken.ExpiredJwtException
import org.springdoc.api.ErrorMessage
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.context.request.WebRequest


@ControllerAdvice
class CustomExceptionHandler {
    @ExceptionHandler(value = [ExpiredJwtException::class])
    fun handleExpiredJwtException(ex: ExpiredJwtException?, request: WebRequest?): ResponseEntity<Any> {
        val errMsg = ErrorMessage("Token provided is expired")
        return ResponseEntity(errMsg, HttpStatus.UNAUTHORIZED)
    }
}