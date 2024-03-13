package com.cy.forum.mapper

import com.cy.forum.model.model.User
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import java.math.BigInteger

@Mapper
interface UserMapper {
    fun isEmailExists(@Param("email")email: String) : Boolean

    fun isNicknameExists(@Param("nickname")nickname: String): Boolean

    fun getUserByEmail(@Param("email")email: String): User?
    fun getUserByNickname(@Param("nickname")nickname: String): User?

    fun getUserByUserId(@Param("userId")userId: BigInteger): User?

    fun create(user: User)
}