package com.prahlad.ecommerce.dto.user;

import com.prahlad.ecommerce.enums.Role;

public record UserResponse(
        Long id,
        String name,
        String email,
        Role role
) {}