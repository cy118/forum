package com.cy.forum.service

import com.cy.forum.common.CustomException
import com.cy.forum.model.model.Authentication
import com.cy.forum.model.model.User
import com.cy.forum.model.request.UserCreateRequest
import com.cy.forum.model.request.UserLoginRequest
import com.cy.forum.utils.JwtAuthenticationFilter
import com.cy.forum.utils.UserRole
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthenticationService {
    @Autowired
    private lateinit var userService: UserService

    @Autowired
    private lateinit var passwordEncoder: PasswordEncoder

    @Autowired
    private lateinit var jwtService: JwtService

    @Autowired
    private lateinit var authenticationManager: AuthenticationManager

    @Autowired
    private lateinit var jwtAuthenticationFilter: JwtAuthenticationFilter

    @Throws(Exception::class)
    fun register(request: UserCreateRequest): Authentication {
        if (request.password != request.passwordCheck) {
            throw CustomException(Constants.ExceptionType.AUTHENTICATION, HttpStatus.BAD_REQUEST, "Password is not matched")
        }

        val isIdUsed: Boolean = userService.isEmailExists(request.email)
        if (isIdUsed) {
            throw CustomException(Constants.ExceptionType.AUTHENTICATION, HttpStatus.BAD_REQUEST, "ID is already in use.")
        }
        val isNicknameUsed: Boolean = userService.isNicknameExists(request.nickname)
        if (isNicknameUsed) {
            throw CustomException(Constants.ExceptionType.AUTHENTICATION, HttpStatus.BAD_REQUEST, "Nickname is already in use.")
        }

        // 회원가입을 위해 유저를 db에 등록
        val user = User()
        user.email = request.email
        user.nickname = request.nickname
        user.setPassword(passwordEncoder.encode(request.password))
        user.role = UserRole.USER
        userService.createUser(user)
        val jwtToken: String = jwtService.generateAccessToken(user)
        return Authentication(jwtToken)
    }

    fun authenticate(request: UserLoginRequest, response: HttpServletResponse): Authentication {
        // 인증 시도. 인증에 실패하면 AuthenticationError 반환됨
        try {
            authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken(
                    request.email,
                    request.password
                )
            )
        } catch(e: Exception) {
            println(e)
        }

        // 인증 성공 시
        val user: User? = userService.getUserByEmail(request.email);

        if (user == null) throw CustomException(Constants.ExceptionType.AUTHENTICATION, HttpStatus.BAD_REQUEST, "Invalid email or password")
        val accessToken: String = jwtService.generateAccessToken(user)
        val refreshToken: String = jwtService.generateRefreshToken(user)

        // TODO 나중에 secure 추가
        response.addHeader("Set-Cookie", "refresh_token=$refreshToken; path=/; SameSite=Lax;")

        return Authentication(accessToken)
    }

    fun logout(email: String, response: HttpServletResponse): Boolean {
        var cookie = Cookie("refresh_token", null)
        cookie.maxAge = 0
        cookie.path = "/"
        response.addCookie(cookie)
        return true
    }

    fun getNewAccessToken(email: String) : Authentication {
        val user: User? = userService.getUserByEmail(email)

        if (user == null) throw CustomException(Constants.ExceptionType.AUTHENTICATION, HttpStatus.BAD_REQUEST, "Invalid Id")
        val accessToken: String = jwtService.generateAccessToken(user)
        return Authentication(accessToken)
    }

    fun getUserByJwt(request : HttpServletRequest): User {
        var user = userService.getUserByEmail(jwtAuthenticationFilter.getUserNicknameByJWT(request))
        if (user == null) throw Exception("error finding user")
        return user;
    }
}