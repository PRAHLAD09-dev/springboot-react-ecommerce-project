package com.prahlad.ecommerce.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.prahlad.ecommerce.entity.User;
import com.prahlad.ecommerce.enums.Role;
import com.prahlad.ecommerce.repository.UserRepository;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner 
{

    private final UserRepository repo;
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) 
    {
        if (repo.findByEmail("admin@ecom.com").isEmpty()) 
        {
            User admin = User.builder()
                    .name("Super Admin")
                    .email("admin@ecom.com")
                    .password(encoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .active(true)
                    .build();

            repo.save(admin);
            System.out.println("Admin created successfully");
        }
    }
}