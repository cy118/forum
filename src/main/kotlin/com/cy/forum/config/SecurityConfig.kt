package com.cy.forum.config

import com.cy.forum.utils.JwtAuthenticationFilter
import com.cy.forum.utils.UserRole
import jakarta.validation.constraints.NotNull
import lombok.RequiredArgsConstructor
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Autowired
    private lateinit var jwtAuthFilter : JwtAuthenticationFilter

    @Autowired
    private lateinit var authenticationProvider: AuthenticationProvider


    @Bean
    @Throws(Exception::class)
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .authorizeHttpRequests() { authorize ->
                authorize
                    .requestMatchers("/api/v1/auth/**").authenticated()
                    .requestMatchers("/api/v1/admin/**").hasAuthority(UserRole.ADMIN.toString())
                    .anyRequest().permitAll()
            }
            .csrf { it.disable() }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(
                jwtAuthFilter,
                UsernamePasswordAuthenticationFilter::class.java
            )

        return http.build()
    }

}
