package com.prahlad.ecommerce.service.Order;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.prahlad.ecommerce.dto.address.AddressResponse;
import com.prahlad.ecommerce.dto.order.OrderItemDTO;
import com.prahlad.ecommerce.dto.order.OrderResponse;
import com.prahlad.ecommerce.dto.order.OrderStatusHistoryDTO;
import com.prahlad.ecommerce.entity.Address;
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
import com.prahlad.ecommerce.repository.AddressRepository;
import com.prahlad.ecommerce.repository.CartItemRepository;
import com.prahlad.ecommerce.repository.CartRepository;
import com.prahlad.ecommerce.repository.MerchantRepository;
import com.prahlad.ecommerce.repository.OrderRepository;
import com.prahlad.ecommerce.repository.OrderStatusHistoryRepository;
import com.prahlad.ecommerce.repository.ProductRepository;
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
	private final AddressRepository addressRepository;
	private final ProductRepository productRepository;

	
	@Transactional
	public OrderResponse placeOrder(String email, Long addressId) 
	{

	    // ================= USER =================
	    User user = userRepository.findByEmail(email)
	            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

	    // ================= ADDRESS =================
	    Address address = addressRepository.findById(addressId)
	            .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

	    // ================= CART =================
	    Cart cart = cartRepository.findByUserWithItems(user)
	            .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

	    if (cart.getItems().isEmpty()) {
	        throw new BadRequestException("Cart is empty");
	    }

	    // ================= ORDER =================
	    Order order = new Order();
	    order.setUser(user);
	    order.setAddress(address); 
	    order.setStatus(OrderStatus.CREATED);

	    List<OrderItem> orderItems = new ArrayList<>();
	    double totalPrice = 0;

	    // ================= ITEMS =================
	    for (CartItem cartItem : cart.getItems()) 
	    {

	        Product product = cartItem.getProduct();

	        if (product == null) 
	        {
	            throw new BadRequestException("Invalid product");
	        }

	        if (product.getStock() < cartItem.getQuantity()) 
	        {
	            throw new BadRequestException(
	                "Insufficient stock for " + product.getName()
	            );
	        }

	        
	        product.setStock(product.getStock() - cartItem.getQuantity());
	        productRepository.save(product); 
	        
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

	    // ================= NOTIFICATIONS =================

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


	    // ================= HISTORY =================
	    OrderStatusHistory history = new OrderStatusHistory();
	    history.setOrder(savedOrder);
	    history.setStatus(OrderStatus.CREATED);
	    history.setUpdatedAt(LocalDateTime.now());
	    history.setUpdatedBy(email);

	    orderStatusHistoryRepository.save(history);

	    // ================= CLEAR CART =================
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

	    OrderStatus current = order.getStatus();

	    if (current == OrderStatus.DELIVERED || current == OrderStatus.CANCELLED) 
	    {
	        throw new BadRequestException("Order already completed");
	    }

	    if (current == status) 
	    {
	        throw new BadRequestException("Status already set");
	    }

	    // ================= ADMIN =================
	    if (isAdmin) {

	        if (status == OrderStatus.CONFIRMED && current != OrderStatus.PENDING) 
	        {
	            throw new BadRequestException("Invalid flow: must be PENDING → CONFIRMED");
	        }

	        if (status == OrderStatus.DELIVERED && current != OrderStatus.OUT_FOR_DELIVERY) 
	        {
	            throw new BadRequestException("Invalid flow: must be OUT_FOR_DELIVERY → DELIVERED");
	        }

	        if (status == OrderStatus.CANCELLED) 
	        {
	            setStatusWithTime(order, OrderStatus.CANCELLED);
	        } 
	        else 
	        {
	            setStatusWithTime(order, status);
	        }
	    }

	    // ================= MERCHANT =================
	    else {

	        boolean isMerchant = order.getOrderItems().stream()
	                .map(i -> i.getProduct())
	                .filter(Objects::nonNull)
	                .map(p -> p.getMerchant())
	                .filter(Objects::nonNull)
	                .anyMatch(m ->
	                        m.isApproved() &&
	                        m.isActive() &&
	                        m.getUser().getEmail().equals(email)
	                );

	        if (!isMerchant) {
	            throw new UnauthorizedException("Not your order");
	        }

	        if (status == OrderStatus.SHIPPED && current == OrderStatus.CONFIRMED) 
	        {
	            setStatusWithTime(order, OrderStatus.SHIPPED);
	        }

	        else if (status == OrderStatus.OUT_FOR_DELIVERY && current == OrderStatus.SHIPPED) 
	        {
	            setStatusWithTime(order, OrderStatus.OUT_FOR_DELIVERY);
	        }

	        else {
	            throw new BadRequestException("Invalid status flow");
	        }
	    }

	    Order savedOrder = orderRepository.save(order);

	    // ================= HISTORY =================
	    OrderStatusHistory history = new OrderStatusHistory();
	    history.setOrder(savedOrder);
	    history.setStatus(savedOrder.getStatus());
	    history.setUpdatedAt(LocalDateTime.now());
	    history.setUpdatedBy(email);

	    orderStatusHistoryRepository.save(history);

	    sendNotifications(savedOrder, savedOrder.getStatus());

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

	    return orderRepository.findOrdersByMerchantId(merchant.getId())
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

	        // ================= CONFIRMED =================
	        case CONFIRMED -> 
	        {

	            Set<String> merchantEmails = order.getOrderItems().stream()
	                    .map(i -> i.getProduct())
	                    .filter(Objects::nonNull)
	                    .map(p -> p.getMerchant())
	                    .filter(m -> m != null && m.isApproved() && m.isActive())
	                    .map(m -> m.getUser().getEmail())
	                    .collect(Collectors.toSet());

	            merchantEmails.forEach(email ->
	                    notificationService.sendNotification(
	                            email,
	                            "New Order Confirmed",
	                            "You received order #" + orderId,
	                            NotificationType.ORDER_CONFIRMED
	                    )
	            );

	            notificationService.sendNotification(
	                    userEmail,
	                    "Order Confirmed",
	                    "Your order #" + orderId + " has been confirmed",
	                    NotificationType.ORDER_CONFIRMED
	            );
	        }

	        // ================= SHIPPED =================
	        case SHIPPED -> notificationService.sendNotification(
	                userEmail,
	                "Order Shipped",
	                "Your order #" + orderId + " is on the way",
	                NotificationType.ORDER_SHIPPED
	        );

	        // ================= DELIVERED =================
	        case DELIVERED -> notificationService.sendNotification(
	                userEmail,
	                "Order Delivered",
	                "Your order #" + orderId + " has been delivered",
	                NotificationType.ORDER_DELIVERED
	        );

	        // ================= CANCELLED =================
	        case CANCELLED -> notificationService.sendNotification(
	                userEmail,
	                "Order Cancelled",
	                "Your order #" + orderId + " has been cancelled",
	                NotificationType.ORDER_CANCELLED
	        );
	        
	        case OUT_FOR_DELIVERY -> notificationService.sendNotification(
	        	    userEmail,
	        	    "Out for Delivery",
	        	    "Your order #" + orderId + " is out for delivery",
	        	    NotificationType. OUT_FOR_DELIVERY
	        	);

	        default -> 
	        {
	      
	        }
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
	        .map(i -> new OrderItemDTO(
	            i.getProduct().getName(),
	            i.getQuantity(),
	            i.getPrice()
	        ))
	        .toList();

	    Address address = order.getAddress();

	    AddressResponse addressDTO = null;

	    if (address != null) {
	        addressDTO = new AddressResponse(
	                        address.getId(),
	                        address.getFullName(),
	                        address.getPhoneNumber(),
	                        address.getStreet(),
	                        address.getCity(),
	                        address.getState(),
	                        address.getZipCode(),
	                        address.getCountry()
	    );
	    }

	    return new OrderResponse(
	        order.getId(),
	        order.getStatus(),
	        order.getTotalPrice(),
	        order.isPaid(),
	        items,
	        addressDTO  
	    );
	}
	
	private void setStatusWithTime(Order order, OrderStatus status) 
	{

	    order.setStatus(status);

	    switch (status) 
	    {
	        case CONFIRMED -> order.setConfirmedAt(LocalDateTime.now());
	        case SHIPPED -> order.setShippedAt(LocalDateTime.now());
	        case OUT_FOR_DELIVERY -> order.setOutForDeliveryAt(LocalDateTime.now());
	        case DELIVERED -> order.setDeliveredAt(LocalDateTime.now());
	        default -> {}
	    }
	}
	private OrderStatusHistoryDTO mapHistory(OrderStatusHistory h) 
	{
		return new OrderStatusHistoryDTO(h.getStatus(), h.getUpdatedAt(), h.getUpdatedBy());
	}
}
