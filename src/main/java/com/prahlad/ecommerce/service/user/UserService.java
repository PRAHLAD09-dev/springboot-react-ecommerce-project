package com.prahlad.ecommerce.service.user;


import org.springframework.stereotype.Service;
import com.prahlad.ecommerce.dto.user.UserResponse;
import com.prahlad.ecommerce.dto.user.UserUpdateRequest;

@Service
public interface UserService 
{

	
	UserResponse getProfile(String email);

//	void resetPassword(ResetPasswordRequest request);
	
	  UserResponse updateProfile(String email, UserUpdateRequest request);

    void deleteAccount(String email);

    String changePassword(String email, String oldPassword, String newPassword);
}