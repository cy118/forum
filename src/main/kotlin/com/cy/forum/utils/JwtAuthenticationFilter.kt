package com.cy.forum.utils

import com.cy.forum.service.JwtService
import io.jsonwebtoken.ExpiredJwtException
import jakarta.servlet.FilterChain
import jakarta.servlet.ServletException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import lombok.RequiredArgsConstructor
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import org.springframework.web.servlet.HandlerExceptionResolver
import java.io.IOException


@Component
@RequiredArgsConstructor
class JwtAuthenticationFilter : OncePerRequestFilter() {
    @Autowired
    private lateinit var jwtService: JwtService

    @Autowired
    private lateinit var userDetailsService: UserDetailsService

    @Autowired
    @Qualifier("handlerExceptionResolver")
    private lateinit var resolver: HandlerExceptionResolver

    @Throws(ServletException::class, IOException::class)
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {

        try {
            // 헤더에서 Authroization 값을 찾음
            val JWT_PREFIX = "Bearer "
            val JWT_HEADER_KEY = "Authorization"
            val authHeader = request.getHeader(JWT_HEADER_KEY)
            val userEmail: String


            // jwt token 형식이 아니면 요청을 차단함
            if (authHeader == null || !authHeader.startsWith(JWT_PREFIX) || authHeader.length == JWT_PREFIX.length + 4) {
                filterChain.doFilter(request, response)
                return
            }
            val jwt = authHeader.substring(JWT_PREFIX.length)

            userEmail = jwtService.extractUsername(jwt) // JWT 토큰으로 부터 유저 이메일 추출
            // jwt 토큰에 유저 이메일이 없고, 아직 인증되지 않은 유저라면
            if (userEmail != null && userEmail != "" && SecurityContextHolder.getContext().authentication == null) {
                // db에서 유저 정보를 가져옴
                val userDetails = userDetailsService.loadUserByUsername(userEmail)
                // token이 유효하다면
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    val authToken = UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.authorities
                    )
                    authToken.details = WebAuthenticationDetailsSource().buildDetails(request)

                    // SecurityContext를 갱신한고 controller로 요청을 전달한다.
                    SecurityContextHolder.getContext().authentication = authToken
                }
            }
            filterChain.doFilter(request, response)
        } catch (e: ExpiredJwtException) {
            resolver.resolveException(request, response, null, e)
        }

    }

    fun getUserNicknameByJWT(request: HttpServletRequest): String {
        val JWT_PREFIX = "Bearer "
        return jwtService.extractUsername(request.getHeader("Authorization").substring(JWT_PREFIX.length))
    }
}
