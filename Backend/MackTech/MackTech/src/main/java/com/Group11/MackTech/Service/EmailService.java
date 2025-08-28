package com.Group11.MackTech.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
public class EmailService {

    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;

    public EmailService(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.javaMailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendEmail(String recipient, String subject, Map<String, Object> model) {
       try{
           MimeMessage message = javaMailSender.createMimeMessage();
           MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

           //load html template
           Context context = new Context();
           context.setVariables(model);
           String htmlContent = templateEngine.process("email-template", context);

           //set email details
           helper.setFrom(fromEmail);
           helper.setTo(recipient);
           helper.setSubject(subject);
           helper.setText(htmlContent, true);

           javaMailSender.send(message);
           System.out.println("HTML Email Sent Successfully!");

       } catch (MessagingException e) {
           System.out.println("Failed to send HTML email.");
           throw new RuntimeException(e);
       }
    }

    public void sendVerificationEmail(String recipient, String subject, Map<String, Object> model) {
        try{
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

            //load html template
            Context context = new Context();
            context.setVariables(model);
            String htmlContent = templateEngine.process("email-verification-code", context);

            //set email details
            helper.setFrom(fromEmail);
            helper.setTo(recipient);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            javaMailSender.send(message);
            System.out.println("HTML Email Sent Successfully!");

        } catch (MessagingException e) {
            System.out.println("Failed to send HTML email.");
            throw new RuntimeException(e);
        }
    }
}
