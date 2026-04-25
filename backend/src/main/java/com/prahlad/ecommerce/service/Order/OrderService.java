package com.prahlad.ecommerce.service.Order;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.prahlad.ecommerce.dto.order.OrderItemDTO;
import com.prahlad.ecommerce.dto.order.OrderResponse;
import com.prahlad.ecommerce.dto.order.OrderStatusHistoryDTO;
import com.prahlad.ecommerce.entity.Cart;
import com.prahlad.ecommerce.entity.CartItem;
import com.prahlad.ecommerce.entity.Merchant;
import com.prahlad.ecommerce.entity.Order;
import com.prahlad.ecommerce.entity.OrderItem;
import com.prahlad.ecommerce.entity.OrderStatusHistory;
import com.prahlad.ecommerce.entity.Product;
import com.prahlad.ecommerce.entity.User;
import com.prahlad.ecommerce.enums.NotificationType;
import com.prahlad.ecommerce.enums.OrderStatus;
import com.prahlad.ecommerce.exception.BadRequestException;
import com.prahlad.ecommerce.exception.ResourceNotFoundException;
import com.prahlad.ecommerce.exception.UnauthorizedException;
import com.prahlad.ecommerce.repository.CartItemRepository;
import com.prahlad.ecommerce.repository.CartRepository;
import com.prahlad.ecommerce.repository.MerchantRepository;
import com.prahlad.ecommerce.repository.OrderRepository;
import com.prahlad.ecommerce.repository.OrderStatusHistoryRepository;
import com.prahlad.ecommerce.repository.UserRepository;
import com.prahlad.ecommerce.service.notification.NotificationService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService 
{

	private final CartRepository cartRepository;
	private final CartItemRepository cartItemRepository;
	private final OrderRepository orderRepository;
	private final UserRepository userRepository;
	private final OrderStatusHistoryRepository orderStatusHistoryRepository;
	private final NotificationService notificationService;
	private final MerchantRepository merchantRepository;

	
	@Transactional
	public OrderResponse placeOrder(String email)
	{

		User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));

		Cart cart = cartRepository.findByUser(user).orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

		if (cart.getItems().isEmpty()) 
		{
			throw new BadRequestException("Cart is empty");
		}
		Order order = new Order();
		order.setUser(user);
		order.setStatus(OrderStatus.CREATED);

		List<OrderItem> orderItems = new ArrayList<>();
		double totalPrice = 0;

		for (CartItem cartItem : cart.getItems()) 
		{

			Product product = cartItem.getProduct();

			if (product.getStock() < cartItem.getQuantity()) 
			{
				throw new BadRequestException("Insufficient stock for " + product.getName());
			}

			product.setStock(product.getStock() - cartItem.getQuantity());

			OrderItem orderItem = new OrderItem();
			orderItem.setProduct(product);
			orderItem.setQuantity(cartItem.getQuantity());

			double itemPrice = product.getPrice() * cartItem.getQuantity();

			orderItem.setPrice(itemPrice);
			orderItem.setOrder(order);

			orderItems.add(orderItem);
			totalPrice += itemPrice;
		}

		order.setOrderItems(orderItems);
		order.setTotalPrice(totalPrice);

		Order savedOrder = orderRepository.save(order);
		
		notificationService.sendNotification(
		    user.getEmail(),
		    "Order Placed ",
		    "Your order #" + savedOrder.getId() + " has been placed successfully.",
		    NotificationType.ORDER_PLACED
		);
		
	
		notificationService.sendNotification(
			"prahladbhakat05@gmail.com",  
		    "New Order Received ",
		    "New order #" + savedOrder.getId() + " placed by " + user.getEmail(),
		    NotificationType.NEW_ORDER_ADMIN
		);

		OrderStatusHistory history = new OrderStatusHistory();
		history.setOrder(savedOrder);
		history.setStatus(OrderStatus.CREATED);
		history.setUpdatedAt(LocalDateTime.now());
		history.setUpdatedBy(email);

		orderStatusHistoryRepository.save(history);

		cartItemRepository.deleteAll(cart.getItems());
		cart.getItems().clear();
		cartRepository.save(cart);

		return mapToDTO(savedOrder);
	}
	
	@Transactional
	public OrderResponse cancelOrder(Long orderId, String email) 
	{
		Order order = orderRepository.findByIdAndUserEmail(orderId, email)
				.orElseThrow(() -> new ResourceNotFoundException("Order not found"));

		if (order.getStatus() == OrderStatus.DELIVERED) 
		{
			throw new BadRequestException("Delivered order cannot be cancelled");
		}

		if (order.getStatus() == OrderStatus.CANCELLED) 
		{
			throw new BadRequestException("Order already cancelled");
		}

		if (order.getStatus() == OrderStatus.SHIPPED) 
		{
			throw new BadRequestException("Shipped order cannot be cancelled");
		}

		order.setStatus(OrderStatus.CANCELLED);
		Order savedOrder = orderRepository.save(order);

		OrderStatusHistory history = new OrderStatusHistory();
		history.setOrder(savedOrder);
		history.setStatus(OrderStatus.CANCELLED);
		history.setUpdatedAt(LocalDateTime.now());
		history.setUpdatedBy(email);

		orderStatusHistoryRepository.save(history);

		notificationService.sendNotification(savedOrder.getUser().getEmail(), "Order Cancelled ",
				"Your order #" + savedOrder.getId() + " has been cancelled.", NotificationType.ORDER_CANCELLED);

		return mapToDTO(savedOrder);
	}

	public List<OrderResponse> getUserOrders(String email, OrderStatus status) 
	{

		User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));

		if (status != null) 
		{
			return orderRepository.findByUserIdAndStatus(user.getId(), status).stream().map(this::mapToDTO).toList();
		}

		return orderRepository.findByUserId(user.getId()).stream().map(this::mapToDTO).toList();
	}

	public OrderResponse getOrderById(Long orderId, String email) 
	{

		Order order = orderRepository.findByIdAndUserEmail(orderId, email)
				.orElseThrow(() -> new UnauthorizedException("Order not found or access denied"));

		return mapToDTO(order);
	}
    
	@Transactional
	public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) 
	{

	    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	    String email = auth.getName();

	    boolean isAdmin = auth.getAuthorities().stream()
	            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

	    Order order = orderRepository.findById(orderId)
	            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
	    
	    if (isAdmin) 
	    {

	        if (status != OrderStatus.CONFIRMED &&
	            status != OrderStatus.CANCELLED &&
	            status != OrderStatus.DELIVERED) 
	        {

	            throw new UnauthorizedException("Admin can only confirm, cancel or deliver order");
	        }

	        order.setStatus(status);
	    }

	    else 
	    {

	        boolean isMerchant = order.getOrderItems().stream()
	                .anyMatch(i -> {
	                    var m = i.getProduct().getMerchant();
	                    return m != null &&
	                           m.isApproved() &&
	                           m.isActive() &&
	                           m.getUser().getEmail().equals(email);
	                });

	        if (!isMerchant) {
	            throw new UnauthorizedException("You are not allowed to update this order");
	        }

	        if (status != OrderStatus.SHIPPED) {
	            throw new UnauthorizedException("Merchant can only ship order");
	        }

	        order.setStatus(OrderStatus.SHIPPED);
	    }

	    Order savedOrder = orderRepository.save(order);

	    sendNotifications(savedOrder, status);

	    OrderStatusHistory history = new OrderStatusHistory();
	    history.setOrder(savedOrder);
	    history.setStatus(savedOrder.getStatus());
	    history.setUpdatedAt(LocalDateTime.now());
	    history.setUpdatedBy(email);

	    orderStatusHistoryRepository.save(history);

	    return mapToDTO(savedOrder);
	}
	
	public List<OrderResponse> getMerchantOrders(String email) 
	{

	    User user = userRepository.findByEmail(email)
	            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

	    Merchant merchant = merchantRepository.findByUser(user)
	            .orElseThrow(() -> new UnauthorizedException("Not a merchant"));

	    if (!merchant.isApproved() || !merchant.isActive()) {
	        throw new UnauthorizedException("Merchant not allowed");
	    }

	    return orderRepository.findOrdersByMerchantId(user.getId())
	            .stream()
	            .map(this::mapToDTO)
	            .toList();
	}
	
	private void sendNotifications(Order order, OrderStatus status) 
	{

	    String orderId = String.valueOf(order.getId());
	    String userEmail = order.getUser().getEmail();

	    switch (status) 
	    {

	        case CONFIRMED -> 
	        {

	            Set<String> merchantEmails = order.getOrderItems().stream()
	                .map(i -> i.getProduct().getMerchant())
	                .filter(m -> m != null && m.isApproved() && m.isActive())
	                .map(m -> m.getUser().getEmail())
	                .collect(Collectors.toSet());

	            for (String email : merchantEmails) 
	            {
	                notificationService.sendNotification(
	                    email,
	                    "New Order Confirmed",
	                    "You received order #" + orderId,
	                    NotificationType.ORDER_CONFIRMED
	                );
	            }

	            notificationService.sendNotification(
	                userEmail,
	                "Order Confirmed",
	                "Your order #" + orderId + " has been confirmed",
	                NotificationType.ORDER_CONFIRMED
	            );
	        }

	        case SHIPPED -> notificationService.sendNotification(
	            userEmail,
	            "Order Shipped",
	            "Your order #" + orderId + " is on the way",
	            NotificationType.ORDER_SHIPPED
	        );

	        case DELIVERED -> notificationService.sendNotification(
	            userEmail,
	            "Order Delivered",
	            "Your order #" + orderId + " has been delivered",
	            NotificationType.ORDER_DELIVERED
	        );

	        case CANCELLED -> notificationService.sendNotification(
	            userEmail,
	            "Order Cancelled",
	            "Your order #" + orderId + " has been cancelled",
	            NotificationType.ORDER_CANCELLED
	        );

	        default -> {}
	    }
	}
	
	public List<OrderStatusHistoryDTO> getOrderTracking(Long orderId, String email) 
	{

		User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));

		Order order = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found"));

		if (!order.getUser().getId().equals(user.getId())) 
		{
			throw new UnauthorizedException("You cannot access this order");
		}

		return orderStatusHistoryRepository.findByOrderOrderByUpdatedAtAsc(order).stream().map(this::mapHistory)
				.toList();
	}
	
	private OrderResponse mapToDTO(Order order) 
	{

		List<OrderItemDTO> items = order.getOrderItems().stream()
				.map(i -> new OrderItemDTO(i.getProduct().getName(), i.getQuantity(), i.getPrice())).toList();

		return new OrderResponse(order.getId(), order.getStatus(), order.getTotalPrice(), order.isPaid(), items);
	}
	
	private OrderStatusHistoryDTO mapHistory(OrderStatusHistory h) 
	{
		return new OrderStatusHistoryDTO(h.getStatus(), h.getUpdatedAt(), h.getUpdatedBy());
	}
}
