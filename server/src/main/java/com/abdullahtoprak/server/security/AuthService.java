package com.abdullahtoprak.server.security;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.abdullahtoprak.server.dtos.UserPrincipal;
import com.abdullahtoprak.server.models.User;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AuthService {
  private final JwtProvider jwtProvider;

  public Map<String, Object> createLoginInfo(Authentication authentication) {
    UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
    User user = userPrincipal.getUser();

    String token = jwtProvider.createToken(authentication);

    Map<String, Object> loginResultMap = new HashMap<>();
    loginResultMap.put("user", user);
    loginResultMap.put("token", token);

    return loginResultMap;
  }

  public Map<String,Object> decodeToken(String token) {
    return jwtProvider.decodeToken(token);
  }

}
