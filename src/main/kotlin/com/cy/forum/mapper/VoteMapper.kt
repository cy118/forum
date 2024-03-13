package com.cy.forum.mapper

import com.cy.forum.model.model.Vote
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import java.math.BigInteger

@Mapper
public interface VoteMapper {
    fun getLikeCountForPost(@Param("postId")postId: BigInteger) : Int

    fun getLikeCountForComment(@Param("commentId")commentId: BigInteger) : Int

    fun getVote(@Param("isPost")isPost: Boolean, @Param("postId")postId: BigInteger?, @Param("commentId")commentId: BigInteger?, @Param("userId")userId: BigInteger) : Vote?

    fun doVote(vote: Vote)

    fun undoVote(@Param("voteId") voteId: BigInteger)

    fun updateVote(@Param("voteId") voteId: BigInteger, @Param("isLike") isLike: Boolean)
}