package com.prahlad.ecommerce.service.admin;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.prahlad.ecommerce.dto.merchant.MerchantResponse;
import com.prahlad.ecommerce.dto.order.OrderItemDTO;
import com.prahlad.ecommerce.dto.order.OrderResponse;
import com.prahlad.ecommerce.dto.user.UserResponse;
import com.prahlad.ecommerce.entity.Merchant;
import com.prahlad.ecommerce.entity.Order;
import com.prahlad.ecommerce.entity.User;
import com.prahlad.ecommerce.enums.NotificationType;
import com.prahlad.ecommerce.exception.ResourceNotFoundException;
import com.prahlad.ecommerce.repository.MerchantRepository;
import com.prahlad.ecommerce.repository.OrderRepository;
import com.prahlad.ecommerce.repository.UserRepository;
import com.prahlad.ecommerce.service.notification.NotificationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService 
{

	private final MerchantRepository merchantRepository;
	private final OrderRepository orderRepository;
	private final UserRepository userRepository;
	private final NotificationService notificationService;


	// ================= DASHBOARD =================
	@Override
	public Map<String, Long> getDashboardStats() 
	{

	    Map<String, Long> stats = new HashMap<>();

	    stats.put("users", userRepository.count());
	    stats.put("orders", orderRepository.count());
	    stats.put("merchants", merchantRepository.count());

	    return stats;
	}
	
	// ================= APPROVE =================
	@Override
	public String approveMerchant(Long merchantId) 
	{
	    Merchant merchant = merchantRepository.findById(merchantId)
	            .orElseThrow(() -> new ResourceNotFoundException("Merchant not found"));

	    String email = merchant.getUser().getEmail(); 

	    if (merchant.isApproved())
	    {
	        notificationService.sendNotification(
	                email,
	                "Already Approved",
	                "Your merchant account is already approved.",
	                NotificationType.MERCHANT_APPROVED
	        );

	        return "Merchant already approved";
	    }

	    merchant.setApproved(true);
	    merchant.setActive(true);

	    merchantRepository.save(merchant);

	    notificationService.sendNotification(
	            email,
	            "Account Approved",
	            "Your merchant account has been approved. You can now start selling",
	            NotificationType.MERCHANT_APPROVED
	    );

	    return "Merchant approved successfully";
	}

	// ================= USERS =================
	@Override
	public List<UserResponse> getAllUsers() 
	{

		return userRepository.findAll().stream().map(this::mapUserToDTO).toList();
	}

	// ================= MERCHANTS =================
	@Override
	public List<MerchantResponse> getAllMerchants() 
	{

		return merchantRepository.findAll().stream().map(this::mapMerchantToDTO).toList();
	}

	// ================= BLOCK =================
	@Override
	public String blockMerchant(Long merchantId) 
	{

		Merchant merchant = merchantRepository.findById(merchantId)
				.orElseThrow(() -> new ResourceNotFoundException("Merchant not found"));
		
		 String email = merchant.getUser().getEmail(); 

		merchant.setActive(false);
		merchantRepository.save(merchant);
		
		notificationService.sendNotification(
				email,
		    "Account Blocked ",
		    "Your account has been blocked by admin.",
		    NotificationType.ACCOUNT_BLOCKED
		);

		return "Merchant blocked successfully";
	}

	// ================= UNBLOCK =================
	@Override
	public String unblockMerchant(Long merchantId) 
	{

		Merchant merchant = merchantRepository.findById(merchantId)
				.orElseThrow(() -> new ResourceNotFoundException("Merchant not found"));
		
		 String email = merchant.getUser().getEmail(); 

		merchant.setActive(true);
		merchantRepository.save(merchant);
		
		notificationService.sendNotification(
				email,
			    "Account Activated ",
			    "Your account is now active again.",
			    NotificationType.ACCOUNT_UNBLOCKED
			);

		return "Merchant unblocked successfully";
	}

	// ================= ORDERS =================
	@Override
	public List<OrderResponse> getAllOrders() 
	{

		return orderRepository.findAll().stream().map(this::mapOrderToDTO).toList();
	}

	// ================= MAPPERS =================

	private UserResponse mapUserToDTO(User user) 
	{
		return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
	}

	private MerchantResponse mapMerchantToDTO(Merchant merchant) 
	{
		return new MerchantResponse(
				merchant.getId(), 
				merchant.getBusinessName(),
				merchant.getUser().getEmail(),
				merchant.isApproved(),
				merchant.isActive());
	}

	private OrderResponse mapOrderToDTO(Order order) 
	{

		List<OrderItemDTO> items = order.getOrderItems().stream()
				.map(i -> new OrderItemDTO(i.getProduct().getName(), i.getQuantity(), i.getPrice())).toList();

		return new OrderResponse(order.getId(), order.getStatus(), order.getTotalPrice(), order.isPaid(), items);
	}
}