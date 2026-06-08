package com.mungnyang.backend.user.dto;

import com.mungnyang.backend.user.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SignupResponse {

    private Long id;
    private String email;
    private String nickname;

    public static SignupResponse from(User user) {
        return SignupResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .build();
    }
}