package com.cy.forum.service

import io.jsonwebtoken.Claims
import io.jsonwebtoken.ExpiredJwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import java.security.Key
import java.util.*
import java.util.function.Function
import kotlin.collections.HashMap

@Service
class JwtService {
    @Value("\${security.secret.key}")
    private val SECRET_KEY: String? = null // jwt 서명 키

    @Value("\${security.jwt_refresh.expired_after_ms}")
    private val JWT_REFRESH_EXPIRED_AFTER_MS = 0 // jwt 토큰 발급 후 몇 ms 후 만료 되는 지
    @Value("\${security.jwt_access.expired_after_ms}")
    private val JWT_ACCESS_EXPIRED_AFTER_MS = 0 // jwt 토큰 발급 후 몇 ms 후 만료 되는 지

    // token으로 부터 username(이메일)을 추출한다.
    fun extractUsername(token: String?): String {
        return extractClaim(token) { obj: Claims -> obj.subject }
    }

    /**
     *
     * @param token jwt 토큰
     * @param claimsResolver jwt 토큰으로 부터 어떤 정보를 추출할 지 지정하는 함수
     * @return 토큰으로 부터 추출한 정보
     * @param <T> 토큰으로 부터 추출한 정보의 타입
    </T> */
    fun <T> extractClaim(token: String?, claimsResolver: Function<Claims, T>): T {
        val claims = extractAllClaims(token)
        return claimsResolver.apply(claims)
    }

    // userDetails만 가지고 토큰 생성
    fun generateAccessToken(userDetails: UserDetails): String {
        return generateToken(HashMap(), userDetails, false)
    }

    fun generateRefreshToken(userDetails: UserDetails): String {
        return generateToken(HashMap(), userDetails, true)
    }

    // claim, userDetails를 가지고 토큰 생성
    fun generateToken(
        extraClaims: Map<String?, Any?>?,
        userDetails: UserDetails,
        isRefresh: Boolean
    ): String {
        var expiredTime = if (isRefresh) JWT_REFRESH_EXPIRED_AFTER_MS else JWT_ACCESS_EXPIRED_AFTER_MS
        return Jwts
            .builder()
            .setClaims(extraClaims)
            .setSubject(userDetails.username)
            .setIssuedAt(Date(System.currentTimeMillis()))
            .setExpiration(Date(System.currentTimeMillis() + expiredTime))
            .signWith(signInKey, SignatureAlgorithm.HS256)
            .compact()
    }

    // 토큰이 유효한 지 여부 확인
    fun isTokenValid(token: String?, userDetails: UserDetails): Boolean {
        val username = extractUsername(token)
        // token으로 부터 추출한 유저네임(이메일)과 db로부터 가져온 유저네임이 같은 지 확인한다.
        val isUserNameMatched = username == userDetails.username

        return isUserNameMatched && !isTokenExpired(token)
    }

    // 토큰이 만료되었는 지 확인
    private fun isTokenExpired(token: String?): Boolean {
        // 현재 날짜보다 만료일이 앞에 있다면 만료되었다고 판단한다.
        return extractExpiration(token).before(Date())
    }

    // 토큰으로부터 토큰 만료일을 가져온다.
    private fun extractExpiration(token: String?): Date {
        return extractClaim(token) { obj: Claims -> obj.expiration }
    }

    // 토큰으로부터 모든 정보를 가져온다
    private fun extractAllClaims(token: String?): Claims {
        return Jwts
            .parserBuilder()
            .setSigningKey(signInKey) /* jwt가 중간에 변경되지 않았는 지 확인하기 위한 서명키 */
            .build()
            .parseClaimsJws(token)
            .getBody()
    }

    private val signInKey: Key
        get() {
            val keyBytes: ByteArray = Decoders.BASE64.decode(SECRET_KEY)
            return Keys.hmacShaKeyFor(keyBytes)
        }
}