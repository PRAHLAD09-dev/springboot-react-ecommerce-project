package com.prahlad.ecommerce.service.Order;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.prahlad.ecommerce.dto.order.OrderItemDTO;
import com.prahlad.ecommerce.dto.order.OrderResponse;
import com.prahlad.ecommerce.dto.order.OrderStatusHistoryDTO;
import com.prahlad.ecommerce.entity.Cart;
import com.prahlad.ecommerce.entity.CartItem;
import com.prahlad.ecommerce.entity.Order;
import com.prahlad.ecommerce.entity.OrderItem;
import com.prahlad.ecommerce.entity.OrderStatusHistory;
import com.prahlad.ecommerce.entity.Product;
import com.prahlad.ecommerce.entity.User;
import com.prahlad.ecommerce.enums.OrderStatus;
import com.prahlad.ecommerce.enums.Role;
import com.prahlad.ecommerce.exception.BadRequestException;
import com.prahlad.ecommerce.exception.ResourceNotFoundException;
import com.prahlad.ecommerce.exception.UnauthorizedException;
import com.prahlad.ecommerce.repository.CartItemRepository;
import com.prahlad.ecommerce.repository.CartRepository;
import com.prahlad.ecommerce.repository.OrderRepository;
import com.prahlad.ecommerce.repository.OrderStatusHistoryRepository;
import com.prahlad.ecommerce.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService 
{

	private final CartRepository cartRepository;
	private final CartItemRepository cartItemRepository;
	private final OrderRepository orderRepository;
	private final UserRepository userRepository;
	private final OrderStatusHistoryRepository orderStatusHistoryRepository;

	
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

	public List<OrderResponse> getUserOrders(String email, OrderStatus status) 
	{

		User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));

		if (status != null) 
		{
			return orderRepository.findByUserIdAndStatus(user.getId(), status).stream().map(this::mapToDTO).toList();
		}

		return orderRepository.findByUserId(user.getId()).stream().map(this::mapToDTO).toList();
	}

	public Order getOrderById(Long orderId) 
	{

		return orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
	}
    
	public OrderResponse updateOrderStatus(Long orderId, OrderStatus status, String email) 
	{

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		Role role = auth.getAuthorities().stream().map(a -> a.getAuthority().replace("ROLE_", "")).map(Role::valueOf)
				.findFirst().orElseThrow(() -> new ResourceNotFoundException("Role not found"));

		Order order = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found"));

		if (role == Role.ADMIN) 
		{

			if (status != OrderStatus.CONFIRMED && status != OrderStatus.CANCELLED && status != OrderStatus.DELIVERED) 
			{
				throw new UnauthorizedException("Admin can only confirm, cancel or deliver order");
			}

			order.setStatus(status);
		}

		else if (role == Role.MERCHANT) 
		{

			boolean belongsToMerchant = order.getOrderItems().stream()
					.anyMatch(i -> i.getProduct().getMerchant().getEmail().equals(email));

			if (!belongsToMerchant) 
			{
				throw new UnauthorizedException("Order does not belong to this merchant");
			}

			if (status != OrderStatus.SHIPPED) 
			{
				throw new UnauthorizedException("Merchant can only ship order");
			}

			order.setStatus(OrderStatus.SHIPPED);
		}

		Order savedOrder = orderRepository.save(order);

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

		User merchant = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));

		return orderRepository.findOrdersByMerchantId(merchant.getId()).stream().map(this::mapToDTO).toList();
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
