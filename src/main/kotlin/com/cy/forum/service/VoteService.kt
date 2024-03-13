package com.cy.forum.service

import com.cy.forum.mapper.VoteMapper
import com.cy.forum.model.model.Vote
import com.cy.forum.model.request.VoteRequest
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.math.BigInteger

@Service
class VoteService {

    @Autowired
    private lateinit var voteMapper: VoteMapper

    fun getLikeCountForPost(postId: BigInteger):Int {
        return voteMapper.getLikeCountForPost(postId)
    }

    fun getLikeCountForComment(commentId: BigInteger): Int {
        return voteMapper.getLikeCountForComment(commentId)
    }

    fun getUserVote(userId:BigInteger, postId:BigInteger?, commentId: BigInteger?) :Int {
        var vote = voteMapper.getVote(postId != null, postId, commentId, userId)
        if (vote == null) return 0
        if (vote.isLike) return 1
        return -1;
    }

    // return 1 when like, -1 when dislike, 0 when deleted
    fun doVote(vote: VoteRequest, userId: BigInteger): Int {
        var voted = voteMapper.getVote(vote.postId != null, vote.postId, vote.commentId, userId)

        if (voted == null) {
            voteMapper.doVote(Vote(vote, userId))
            return if (vote.isLike) 1 else -1;
        }
        else
        {
            if (vote.isLike == voted.isLike) {
                undoVote(voted.voteId)
                return 0;
            }
            else {
                updateVote(voted.voteId, vote.isLike)
                return if (vote.isLike) 1 else -1;
            }
        }
    }

    fun undoVote(voteId: BigInteger) {
        voteMapper.undoVote(voteId)
    }

    fun updateVote(voteId: BigInteger, isLike: Boolean) {
        voteMapper.updateVote(voteId, isLike)
    }
}