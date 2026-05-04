package com.prahlad.ecommerce.service.otp;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

@Service
@RequiredArgsConstructor
@Transactional
public class EmailService 
{

    @Value("${brevo.api.key}")
    private String apiKey;

    public void sendOtp(String toEmail, String otp) 
    {
        sendMail(
                toEmail,
                "OTP Verification",
                "Hi,\n\n"
                + "Your verification code is: " + otp
                + "\nThis code expires in 5 minutes.\n\n"
                + "Thanks,\nEcommerce Team"
        );
    }

    public void sendSimpleMail(String toEmail, String subject, String body) 
    {
        sendMail(toEmail, subject, body);
    }

    private void sendMail(String toEmail, String subject, String body) 
    {
        try {

            OkHttpClient client = new OkHttpClient();

            String jsonBody = "{"
                    + "\"sender\":{"
                    + "\"name\":\"Ecommerce Team\","
                    + "\"email\":\"introvertprahlad@gmail.com\""
                    + "},"
                    + "\"to\":[{"
                    + "\"email\":\"" + toEmail + "\""
                    + "}],"
                    + "\"subject\":\"" + subject + "\","
                    + "\"textContent\":\"" + body + "\""
                    + "}";

            RequestBody requestBody = RequestBody.create(
                    jsonBody,
                    MediaType.parse("application/json")
            );

            Request request = new Request.Builder()
                    .url("https://api.brevo.com/v3/smtp/email")
                    .post(requestBody)
                    .addHeader("accept", "application/json")
                    .addHeader("api-key", apiKey)
                    .addHeader("content-type", "application/json")
                    .build();

            Response response = client.newCall(request).execute();

            if (!response.isSuccessful()) 
            {
                throw new RuntimeException(
                        "Brevo mail failed: " + response.body().string()
                );
            }

            System.out.println("Email sent successfully");

        } 
        catch (Exception e) 
        {
            throw new RuntimeException(
                    "Email sending failed: " + e.getMessage()
            );
        }
    }
}
//    @Value("${sendgrid.api.key}")
//    private String apiKey;
//
//    @Value("${sendgrid.from.email}")
//    private String fromEmail;
//    
//    
//    @Async
//    public void sendOtp(String toEmail, String otp) 
//    {
//
//        Email from = new Email(fromEmail , "Ecommerce");
//        Email to = new Email(toEmail);
//        
//
//        Content content = new Content(
//                "text/plain",
//                " Hi,\n " +
//
//                " Your verification code for Ecommerce App: "  + otp + "\nThis code will expire in 5 minutes."
//                +
//                 "\nIf you did not request this, please ignore.\n"
//                +
//                 "\nThanks,"
//                +
//                 "\nTeam Ecommerce"
//        );
//
//        Mail mail = new Mail(from, "OTP Verification", to, content);
//
//        try 
//        {
//        	SendGrid sg = new SendGrid(apiKey);
//
//        	Request request = new Request();
//        	request.setMethod(Method.POST);
//        	request.setEndpoint("mail/send");
//        	request.setBody(mail.build());
//
//        	  System.out.println("Before email");
//        	  
//        	  Response response = sg.api(request);
//
//        	  System.out.println("STATUS: " + response.getStatusCode());
//        	  System.out.println("BODY: " + response.getBody());
//        	  System.out.println("HEADERS: " + response.getHeaders());
//        	  System.out.println("After email");
//
//            if (response.getStatusCode() >= 400) 
//            {
//                throw new EmailException("Failed to send email");
//            }
//
//        } 
//        
//        catch (Exception e) 
//        {
//        	e.printStackTrace();
//            throw new EmailException("Email sending failed");
//        }
//    }
//    
//    public void sendSimpleMail(String toEmail, String subject, String body) 
//    {
//        
//        Email from = new Email(fromEmail, "Ecommerce App");
//        Email to = new Email(toEmail);
//
//        Content content = new Content("text/plain", body);
//
//        Mail mail = new Mail(from, subject, to, content);
//
//        SendGrid sg = new SendGrid(apiKey);
//
//        Request request = new Request();
//        try 
//        {
//            request.setMethod(Method.POST);
//            request.setEndpoint("mail/send");
//            request.setBody(mail.build());
//
//          
//            
//            Response response = sg.api(request);
//            
//          
//
//            if (response.getStatusCode() >= 400) 
//            {
//            	
//                throw new EmailException("Email sending failed");
//            }
//
//        } 
//        catch (Exception e) 
//        {
//        	e.printStackTrace();
//            throw new EmailException("Error sending email: " + e.getMessage());
//        }
//    }
//}