package org.patriciabausan.service;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
public class CorsGlobalFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletResponse response = (HttpServletResponse) res;
        HttpServletRequest request = (HttpServletRequest) req;

        // Forzamos las cabeceras en CUALQUIER petición (OPTIONS, DELETE, GET, etc.)
        response.setHeader("Access-Control-Allow-Origin", "https://voltagameabp.netlify.app");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "ngrok-skip-browser-warning, Content-Type, Authorization, X-Requested-With, Authorized, authorized, Authorizated");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Max-Age", "3600"); // Cachea el permiso por 1 hora

        // Si es OPTIONS, respondemos OK directamente y cortamos aquí
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }


        chain.doFilter(req, res);
    }
}