package com.prahlad.ecommerce.security;


import com.prahlad.ecommerce.entity.Merchant;
import com.prahlad.ecommerce.entity.User;
import com.prahlad.ecommerce.repository.MerchantRepository;
import com.prahlad.ecommerce.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter 
{

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final MerchantRepository merchantRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException 
    {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) 
        {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) 
        {

        	User user = userRepository.findByEmail(email).orElse(null);

        	if (user == null) {
        	    Merchant merchant = merchantRepository.findByEmail(email).orElse(null);

        	    if (merchant != null && jwtUtil.isTokenValid(token)) 
        	    {
        	        UsernamePasswordAuthenticationToken authToken =
        	                new UsernamePasswordAuthenticationToken(
        	                        merchant.getEmail(),
        	                        null,
        	                        merchant.getAuthorities()
        	                );

        	        authToken.setDetails(
        	                new WebAuthenticationDetailsSource().buildDetails(request)
        	        );

        	        SecurityContextHolder.getContext().setAuthentication(authToken);
        	    }

        	} 
        	else if (jwtUtil.isTokenValid(token)) 
        	{

        	    UsernamePasswordAuthenticationToken authToken =
        	            new UsernamePasswordAuthenticationToken(
        	                    user.getEmail(),
        	                    null,
        	                    user.getAuthorities()
        	            );

        	    authToken.setDetails(
        	            new WebAuthenticationDetailsSource().buildDetails(request)
        	    );

        	    SecurityContextHolder.getContext().setAuthentication(authToken);
        	}
        }

        filterChain.doFilter(request, response);
    }
}