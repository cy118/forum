package com.cy.forum.service

import com.cy.forum.mapper.UserMapper
import com.cy.forum.model.model.User
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigInteger

@Service
@Transactional
class UserService {

    @Autowired
    private lateinit var userMapper: UserMapper

   fun isEmailExists(email: String): Boolean {
        return userMapper.isEmailExists(email);
    }


    fun isNicknameExists(nickname: String): Boolean {
        return userMapper.isNicknameExists(nickname);
    }

    fun createUser(user: User) {
        userMapper.create(user)
    }


    fun getUserByEmail(email: String): User? {
        return userMapper.getUserByEmail(email)
    }

    fun getUserByUserId(userId: BigInteger): User? {
        return userMapper.getUserByUserId(userId)
    }

    fun getUserByNickname(nickname: String): User? {
        return userMapper.getUserByNickname(nickname)
    }
}