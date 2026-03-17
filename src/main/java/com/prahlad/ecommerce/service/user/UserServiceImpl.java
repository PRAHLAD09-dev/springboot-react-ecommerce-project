package com.prahlad.ecommerce.service.user;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.prahlad.ecommerce.dto.user.UserResponse;
import com.prahlad.ecommerce.dto.user.UserUpdateRequest;
import com.prahlad.ecommerce.entity.User;
import com.prahlad.ecommerce.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService 
{

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	@Override
	public UserResponse getProfile(String email) 
	{

		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		return mapToDTO(user);
	}

	@Override
	public UserResponse updateProfile(String email, UserUpdateRequest request) 
	{

		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));


		if (request.name() != null) 
		{
			user.setName(request.name());
		}

		userRepository.save(user);

		return mapToDTO(user);
	}

	@Override
	public void deleteAccount(String email) 
	{

		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		userRepository.delete(user);
	}

	@Override
	public String changePassword(String email, String oldPassword, String newPassword) 
	{

		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		if (!passwordEncoder.matches(oldPassword, user.getPassword())) 
		{
			throw new RuntimeException("Old password is incorrect");
		}

		user.setPassword(passwordEncoder.encode(newPassword));

		userRepository.save(user);

		return "Password changed successfully";
	}

	
	private UserResponse mapToDTO(User user) 
	{
		return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
	}
}