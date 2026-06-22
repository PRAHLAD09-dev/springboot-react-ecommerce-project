package com.prahlad.ecommerce.security;

import java.io.IOException;
import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.prahlad.ecommerce.entity.User;
import com.prahlad.ecommerce.enums.Role;
import com.prahlad.ecommerce.repository.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler
{

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException, ServletException
    {

        OAuth2User oauthUser =
                (OAuth2User) authentication.getPrincipal();

        String email =
                oauthUser.getAttribute("email");

        String name =
                oauthUser.getAttribute("name");

        Optional<User> existingUser =
                userRepository.findByEmail(email);

        User user;

        if (existingUser.isPresent())
        {
            user = existingUser.get();
        }
        else
        {
            user = User.builder()
                    .name(name)
                    .email(email)
                    .password("GOOGLE_LOGIN")
                    .role(Role.USER)
                    .active(true)
                    .build();

            userRepository.save(user);
        }

        String token =
                jwtUtil.generateToken(user);
        response.sendRedirect(
                "https://springboot-react-ecommerce-project-alpha.vercel.app/oauth-success?token="
                        + token
        );
//        response.sendRedirect(
//                "http://localhost:5173/oauth-success?token="
//                        + token
//        );
    }
}