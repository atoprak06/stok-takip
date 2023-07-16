package com.abdullahtoprak.server.security;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.abdullahtoprak.server.dtos.UserDto;
import com.abdullahtoprak.server.models.User;
import com.abdullahtoprak.server.services.UserService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.security.core.Authentication;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    /* return jwt token if authenticated */
    @PostMapping("/login")
    public ResponseEntity<?> getLoginInfo(Authentication authentication) {

        return ResponseEntity.status(HttpStatus.OK).body(authService.createLoginInfo(authentication));

    }

    /* create new user */
    @PostMapping
    @RequestMapping("/register")
    public ResponseEntity<User> register(@ModelAttribute UserDto userDto) {

        User newUser = userService.saveUser(userDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }

    @GetMapping("/verify-token")
    public ResponseEntity<Map<String, Object>> verifyToken(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        System.out.println(token);
        if (token == null || !token.startsWith("Bearer ")) {
            // Handle missing or invalid token
            return null;
        }
        token = token.substring(7);

        return ResponseEntity.status(HttpStatus.OK).body(authService.decodeToken(token));

    }
}
