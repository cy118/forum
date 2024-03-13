package com.cy.forum.mapper

import com.cy.forum.model.model.Post
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import java.math.BigInteger

@Mapper
public interface PostMapper {
    fun getPosts(@Param("offset")offset: Int, @Param("limit") limit: Int) : List<Post>

    fun getPost(@Param("postId")postId: BigInteger): Post

    fun createPost(post: Post)

    fun editPost(post: Post)

    fun deletePost(@Param("postId")postId: BigInteger)
}