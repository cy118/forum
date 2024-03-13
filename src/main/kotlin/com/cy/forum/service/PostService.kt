package com.cy.forum.service

import com.cy.forum.mapper.PostMapper
import com.cy.forum.model.request.PostRequest
import com.cy.forum.model.request.PostEditRequest
import com.cy.forum.model.model.Post
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.math.BigInteger

@Service
class PostService {

    @Autowired
    private lateinit var postMapper: PostMapper

    fun getPosts(offset: Int, limit: Int): List<Post> {
        return postMapper.getPosts(offset, limit)
    }

    fun getPost(postId: BigInteger): Post {
        return postMapper.getPost(postId)
    }

    fun createPost(post: PostRequest, userId: BigInteger) {
        postMapper.createPost(Post(post, userId))
    }

    fun editPost(post: PostEditRequest) {
        postMapper.editPost(Post(post))
    }

    fun deletePost(postId: BigInteger) {
        postMapper.deletePost(postId)
    }
}