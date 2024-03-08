package servlet;


import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import org.apache.commons.lang3.tuple.MutablePair;
import utils.TTLFunctions;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;

import java.io.IOException;
import java.io.PrintWriter;



@WebServlet("/generateTTL")
public class generateTTL extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        StringBuffer jb = new StringBuffer();

        String line = null;
        try {
            BufferedReader reader = request.getReader();
            while ((line = reader.readLine()) != null)
                jb.append(line);
        } catch (Exception e) {
            e.printStackTrace();
        }
        JsonObject params = JsonParser.parseString(jb.toString()).getAsJsonObject();
        MutablePair<String, StringBuffer> DocRI_TTL = TTLFunctions.generateTTL(params);
        StringBuffer o = DocRI_TTL.getValue();

        out.write(o.toString());


    }



}
