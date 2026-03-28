package com.prahlad.ecommerce.exception;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.prahlad.ecommerce.dto.apiresponce.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler 
{

	private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ApiResponse<Object>> handleNotFound(ResourceNotFoundException ex) 
	{

		log.warn("Resource not found: {}", ex.getMessage());

		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(ex.getMessage()));
	}

	@ExceptionHandler(BadRequestException.class)
	public ResponseEntity<ApiResponse<Object>> handleBadRequest(BadRequestException ex) 
	{

		log.warn("Bad request: {}", ex.getMessage());

		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(ex.getMessage()));
	}

	@ExceptionHandler(UnauthorizedException.class)
	public ResponseEntity<ApiResponse<Object>> handleUnauthorized(UnauthorizedException ex) 
	{

		log.warn("Unauthorized access: {}", ex.getMessage());

		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error(ex.getMessage()));
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiResponse<Map<String, String>>> handleValidation(MethodArgumentNotValidException ex) 
	{

		Map<String, String> errors = new HashMap<>();

		ex.getBindingResult().getFieldErrors().forEach(err -> errors.put(err.getField(), err.getDefaultMessage()));

		log.warn("Validation failed: {}", errors);

		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(new ApiResponse<>(false, "Validation failed", errors));
	}

	@ExceptionHandler(EmailException.class)
	public ResponseEntity<ApiResponse<?>> handleEmail(EmailException ex) 
	{

	    log.error("Email sending failed: {}", ex.getMessage());

	    return ResponseEntity
	            .status(HttpStatus.INTERNAL_SERVER_ERROR)
	            .body(ApiResponse.error("Failed to send email. Please try again later."));
	}
	
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiResponse<Object>> handleGlobal(Exception ex) 
	{

		log.error("Unexpected error occurred: ", ex);

		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error("Something went wrong"));
	}
}