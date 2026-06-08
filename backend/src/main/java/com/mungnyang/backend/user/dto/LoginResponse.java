package com.mungnyang.backend.user.dto;

import com.mungnyang.backend.user.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {

    private Long id;
    private String email;
    private String nickname;
    private String accessToken;

    public static LoginResponse of(User user, String accessToken) {
        return LoginResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .accessToken(accessToken)
                .build();
    }
}