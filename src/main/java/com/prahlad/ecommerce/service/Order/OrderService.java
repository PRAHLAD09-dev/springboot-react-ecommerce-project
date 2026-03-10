package com.prahlad.ecommerce.service.Order;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.prahlad.ecommerce.entity.Cart;
import com.prahlad.ecommerce.entity.CartItem;
import com.prahlad.ecommerce.entity.Order;
import com.prahlad.ecommerce.entity.OrderItem;
import com.prahlad.ecommerce.entity.Product;
import com.prahlad.ecommerce.entity.User;
import com.prahlad.ecommerce.enums.OrderStatus;
import com.prahlad.ecommerce.enums.Role;
import com.prahlad.ecommerce.repository.CartItemRepository;
import com.prahlad.ecommerce.repository.CartRepository;
import com.prahlad.ecommerce.repository.OrderRepository;
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

		cartItemRepository.deleteAll(cart.getItems());
		cart.getItems().clear();
		cartRepository.save(cart);

		return savedOrder;
	}

	public List<Order> getUserOrders(User user) 
	{

		return orderRepository.findByUserId(user.getId());
	}

	public Order getOrderById(Long orderId) 
	{

		return orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
	}
    
	public Order updateOrderStatus(Long orderId, OrderStatus status, String email) 
	{

		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));

		if (user.getRole() == Role.ADMIN) 
		{

			if (status != OrderStatus.CONFIRMED && status != OrderStatus.CANCELLED) 
			{
				throw new RuntimeException("Admin can only confirm or cancel order");
			}

		} else if (user.getRole() == Role.MERCHANT) 
		{

			if (status != OrderStatus.SHIPPED) 
			{
				throw new RuntimeException("Merchant can only ship order");
			}

		} 
		else 
		{
			throw new RuntimeException("User cannot update order status");
		}

		order.setStatus(status);

		return orderRepository.save(order);
	}
	
	public List<Order> getMerchantOrders(String email) 
	{

		User merchant = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		return orderRepository.findOrdersByMerchantId(merchant.getId());
	}
}
