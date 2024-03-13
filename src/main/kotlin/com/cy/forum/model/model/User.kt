package com.cy.forum.model.model

import com.cy.forum.utils.UserRole
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import java.math.BigInteger

class User : UserDetails {
    var user_id: BigInteger = BigInteger("0")
    var email: String = ""
    private var password: String = ""
    var nickname: String = ""
    var role: UserRole = UserRole.USER


    constructor() {

    }

    override fun getAuthorities(): MutableCollection<out GrantedAuthority> {
        return mutableListOf(SimpleGrantedAuthority(role.toString()))
    }

    fun setPassword(pw: String) {
        password = pw;
    }

    override fun getPassword(): String {
        return this.password;
    }


    override fun getUsername(): String {
        return email
    }

    override fun isAccountNonExpired(): Boolean {
        return true;
    }

    override fun isAccountNonLocked(): Boolean {
        return true;
    }

    override fun isCredentialsNonExpired(): Boolean {
        return true;
    }

    override fun isEnabled(): Boolean {
        return true;
    }
}