package com.cy.forum.mapper

import com.cy.forum.model.model.Comment
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import java.math.BigInteger

@Mapper
interface CommentMapper {

    fun getComment(@Param("commentId") commentId: BigInteger) : Comment
    fun getComments(@Param("postId")postId: BigInteger, @Param("commentId")commentId: BigInteger) : List<Comment>

    fun createComment(comment: Comment)

    fun editComment(comment: Comment)

    fun deleteComment(@Param("commentId")commentId: BigInteger)

    fun getCommentCountForPost(@Param("postId")postId: BigInteger): Int
}