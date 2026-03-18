package com.prahlad.ecommerce.exception;

@SuppressWarnings("serial")
public class UnauthorizedException extends RuntimeException 
{

    public UnauthorizedException(String message) {
        super(message);
    }
}