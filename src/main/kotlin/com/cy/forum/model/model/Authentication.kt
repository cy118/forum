package com.cy.forum.model.model

import lombok.AllArgsConstructor

class Authentication {
    var token: String = ""
    
    constructor(token: String) {
        this.token = token
    }
}