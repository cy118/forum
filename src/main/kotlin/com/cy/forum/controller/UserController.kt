package com.cy.forum.controller

import com.cy.forum.model.model.Authentication
import com.cy.forum.model.model.User
import com.cy.forum.model.request.UserCreateRequest
import com.cy.forum.model.request.UserLoginRequest
import com.cy.forum.service.AuthenticationService
import com.cy.forum.service.UserService
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.math.BigInteger

@RestController
@Tag(name = "User", description = "apis for user")
class UserController {

    @Autowired
    private lateinit var userService: UserService

    @Autowired
    private lateinit var authService: AuthenticationService

    @GetMapping("/api/v1/getUser")
    fun getUser(@RequestParam email: String): User? {
        return userService.getUserByEmail(email)
    }

    @GetMapping("/api/v1/getUserById")
    fun getUserById(@RequestParam userId: BigInteger) : User? {
        return userService.getUserByUserId(userId)
    }

    @PostMapping("/api/v1/createUser")
    @Throws(Exception::class)
    fun createUser(@RequestBody user: UserCreateRequest): ResponseEntity<Authentication> {
        return ResponseEntity.ok(authService.register(user))
    }

    @PostMapping("/api/v1/login")
    @Throws(Exception::class)
    fun login(@RequestBody user: UserLoginRequest, response: HttpServletResponse): ResponseEntity<Authentication> {
        return ResponseEntity.ok(authService.authenticate(user, response))
    }

    @PostMapping("/api/v1/auth/logout")
    fun logout(@RequestParam email: String, response: HttpServletResponse): ResponseEntity<Boolean> {
        return ResponseEntity.ok(authService.logout(email, response))
    }

    @GetMapping("/api/v1/admin")
    fun admin(): String {
        return "admin success";
    }

    @PostMapping("/api/v1/auth/token")
    fun getNewAccessTokenByRefreshToken(@RequestParam email: String) : ResponseEntity<Authentication> {
        return ResponseEntity.ok(authService.getNewAccessToken(email))
    }
}