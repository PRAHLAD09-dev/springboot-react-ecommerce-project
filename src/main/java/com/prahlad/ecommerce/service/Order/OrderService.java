package com.prahlad.ecommerce.service.Order;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.prahlad.ecommerce.entity.Cart;
import com.prahlad.ecommerce.entity.CartItem;
import com.prahlad.ecommerce.entity.Order;
import com.prahlad.ecommerce.entity.OrderItem;
import com.prahlad.ecommerce.entity.OrderStatusHistory;
import com.prahlad.ecommerce.entity.Product;
import com.prahlad.ecommerce.entity.User;
import com.prahlad.ecommerce.enums.OrderStatus;
import com.prahlad.ecommerce.enums.Role;
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

	public Order placeOrder(User user) 
	{

		Cart cart = cartRepository.findByUser(user).orElseThrow(() -> new RuntimeException("Cart not found"));

		if (cart.getItems().isEmpty()) 
		{
			throw new RuntimeException("Cart is empty");
		}

		Order order = new Order();
		order.setUser(user);
		order.setStatus(OrderStatus.CREATED);

		List<OrderItem> orderItems = new ArrayList<>();

		double totalPrice = 0;

		for (CartItem cartItem : cart.getItems()) 
		{

			Product product = cartItem.getProduct();

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
		history.setUpdatedBy(user.getEmail());

		orderStatusHistoryRepository.save(history);
		
		cartItemRepository.deleteAll(cart.getItems());
		cart.getItems().clear();
		cartRepository.save(cart);

		return savedOrder;
	}

	public List<Order> getUserOrders(User user, OrderStatus status) 
	{

		if (status == null) 
		{
			return orderRepository.findByUserId(user.getId());
		}

		return orderRepository.findByUserIdAndStatus(user.getId(), status);
	}

	public Order getOrderById(Long orderId) 
	{

		return orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
	}
    
	public Order updateOrderStatus(Long orderId, OrderStatus status, String email) 
	{

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		Role role = auth.getAuthorities().stream().map(a -> a.getAuthority().replace("ROLE_", "")).map(Role::valueOf)
				.findFirst().orElseThrow(() -> new RuntimeException("Role not found"));

		Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));

		if (role == Role.ADMIN) 
		{

			if (status != OrderStatus.CONFIRMED && status != OrderStatus.CANCELLED && status != OrderStatus.DELIVERED) 
			{
				throw new RuntimeException("Admin can only confirm, cancel or deliver order");
			}

			order.setStatus(status);
		}

		else if (role == Role.MERCHANT) 
		{

			boolean belongsToMerchant = order.getOrderItems().stream()
					.anyMatch(i -> i.getProduct().getMerchant().getEmail().equals(email));

			if (!belongsToMerchant) 
			{
				throw new RuntimeException("Order does not belong to this merchant");
			}

			if (status != OrderStatus.SHIPPED) 
			{
				throw new RuntimeException("Merchant can only ship order");
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

	    return savedOrder;
	}
	
	public List<Order> getMerchantOrders(String email) 
	{

		User merchant = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		return orderRepository.findOrdersByMerchantId(merchant.getId());
	}
	
	public List<OrderStatusHistory> getOrderTracking(Long orderId, String email) 
	{

		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));

		if (!order.getUser().getId().equals(user.getId())) 
		{
			throw new RuntimeException("You cannot access this order");
		}

		return orderStatusHistoryRepository.findByOrderOrderByUpdatedAtAsc(order);
	}
}
