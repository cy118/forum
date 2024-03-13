import axios from "axios";
import {getConfig} from "@testing-library/react";
import cookie from 'js-cookie'


export async function httpAuthRequest(method, url, body, success, fail) {
    await axios({
        method: method,
        url: "/auth" + url,
        data: body,
        headers: {
            'Authorization': "Bearer " + localStorage.getItem("access_token"),
            'Content-Type': 'application/json;charset=UTF-8'
        }
    }).then((response) => {
        if (response.status === 200) {
            success(response)
        }
    }).catch (function (error) {
        var refreshToken = cookie.get("refresh_token")
        var email = localStorage.getItem("email")
        if (error.response.status === 401 && refreshToken != null) {
            axios.post(`/auth/token?email=${email}`,
                null, {
                    headers: {
                        'Authorization': "Bearer " + refreshToken,
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
            }).then((response2) => {
                // console.log(response2)
                localStorage.setItem("access_token", response2.data.token)
                httpAuthRequest(method, url, body, success, fail)
            }).catch(function (error2) {
                // console.log(error2)
                fail(error2)
            })
        } else if (error.response.status === 405){
            // console.log(error)
            alert(error.response.statusText)
        } else {
            fail(error)
        }
    })

}

export async function httpRequest(method, url, body, success, fail) {
    axios({
        method: method,
        url: url,
        data: body,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    }).then((response) => {
        if (response.status === 200) {
            success(response)
        }
        else {
            fail(response.error)
        }
    }).catch(function (error) {
        console.log(error)
    })
}