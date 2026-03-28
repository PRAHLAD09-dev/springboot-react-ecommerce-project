package com.prahlad.ecommerce.exception;

@SuppressWarnings("serial")
public class EmailException extends RuntimeException 
{

    public EmailException(String message) 
    {
        super(message);
    }
}