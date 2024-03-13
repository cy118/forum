import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import java.util.Date

object JwtTokenUtil {

    fun createToken(email: String, key: String, expireTimeMs: Long): String {
        val claims: Claims = Jwts.claims()
        claims["email"] = email
        return Jwts.builder()
            .setClaims(claims)
            .setIssuedAt(Date(System.currentTimeMillis()))
            .setExpiration(Date(System.currentTimeMillis() + expireTimeMs))
            .signWith(SignatureAlgorithm.HS256, key)
            .compact()
    }

    fun getEmail(token: String, secretKey: String): String {
        return extractClaims(token, secretKey)["email"].toString()
    }

    fun isExpired(token: String, secretKey: String): Boolean {
        val expiredDate = extractClaims(token, secretKey).expiration
        return expiredDate.before(Date())
    }

    private fun extractClaims(token: String, secretKey: String): Claims {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).body
    }
}

