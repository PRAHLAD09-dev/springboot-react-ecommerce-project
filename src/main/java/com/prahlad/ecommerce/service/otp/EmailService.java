package com.prahlad.ecommerce.service.otp;

import com.prahlad.ecommerce.exception.EmailException;
import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService 
{
	
	

    @Value("${sendgrid.api.key}")
    private String apiKey;

    @Value("${sendgrid.from.email}")
    private String fromEmail;
    
    

    public void sendOtp(String toEmail, String otp) 
    {

        Email from = new Email(fromEmail , "Prahlad Bhakat");
        Email to = new Email(toEmail);
        

        Content content = new Content(
                "text/plain",
                " Hi,\n " +

                " Your verification code for Ecommerce App: "  + otp + "\nThis code will expire in 5 minutes."
                +
                 "\nIf you did not request this, please ignore.\n"
                +
                 "\nThanks,"
                +
                 "\nTeam Ecommerce"
        );

        Mail mail = new Mail(from, "OTP Verification", to, content);

        try 
        {
//        	System.out.println("EMAIL START");

        	SendGrid sg = new SendGrid(apiKey);
//        	System.out.println("SENDGRID CREATED");

        	Request request = new Request();
        	request.setMethod(Method.POST);
        	request.setEndpoint("mail/send");
        	request.setBody(mail.build());

//        	System.out.println("REQUEST READY");

        	Response response = sg.api(request);

//        	System.out.println("RESPONSE: " + response.getStatusCode());
            
            

            if (response.getStatusCode() >= 400) 
            {
                throw new EmailException("Failed to send email");
            }

        } 
        
        catch (Exception e) 
        {
            throw new EmailException("Email sending failed");
        }
    }
}
//@Service
//@RequiredArgsConstructor
//public class EmailService 
//{
//
//    private final JavaMailSender mailSender;
//
//    @Async
//    public void sendOtp(String to, String otp) 
//    {
//
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(to);
//        message.setSubject("OTP Verification - ECommerce App");
//        message.setText("""
//        		Your OTP is: %s
//
//        		Valid for 5 minutes.
//
//        		Do not share this with anyone.
//        		""".formatted(otp));
//
//        mailSender.send(message);
//    }
//}