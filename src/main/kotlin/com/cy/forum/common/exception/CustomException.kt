package com.cy.forum.common
import org.springframework.http.HttpStatus

class CustomException(
    exceptionType: Constants.ExceptionType, val httpStatus: HttpStatus,
    message: String,
) : Exception(exceptionType.toString() + message) {
    private val exceptionType: Constants.ExceptionType = exceptionType

    fun getExceptionType(): Constants.ExceptionType {
        return exceptionType
    }

    val httpStatusCode: Int
        get() = httpStatus.value()

    val httpStatusType: String
        get() = httpStatus.reasonPhrase

    companion object {
        private const val serialVersionUID = 4663380430591151694L
    }
}