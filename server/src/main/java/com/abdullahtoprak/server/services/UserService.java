package com.abdullahtoprak.server.services;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.abdullahtoprak.server.dtos.UserDto;
import com.abdullahtoprak.server.dtos.UserPrincipal;
import com.abdullahtoprak.server.models.User;
import com.abdullahtoprak.server.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User saveUser(UserDto userDto) {
        if (userRepository.findByUsername(userDto.getUsername()).isPresent()) {
            return null;
        }
        ;
        String hashedPassword = passwordEncoder.encode(userDto.getPassword());
        User user = User.builder().username(userDto.getUsername()).password(hashedPassword).roles("admin").build();
        User savedUser = userRepository.save(user);
        return savedUser;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username).map(user -> new UserPrincipal(user))
                .orElseThrow(() -> new UsernameNotFoundException("username " + username + "is not found"));
    }

}
