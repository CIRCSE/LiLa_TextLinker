package servlet;


import com.google.gson.*;
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


@WebServlet("/generateJSON")
public class generateJSON extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {



            request.setCharacterEncoding("UTF-8");
            response.setCharacterEncoding("UTF-8");
            response.setContentType("application/json");
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

            JsonArray textToProcess = params.get("textToProcess").getAsJsonArray();
            JsonObject sentences = new JsonObject();
            sentences.add("sentences", textToProcess.getAsJsonArray());
            Gson gson = new GsonBuilder().setPrettyPrinting().create();

            out.write(gson.toJson(sentences).toString()
                    .replace("lilaLemma:","http://lila-erc.eu/data/id/lemma/")
                    .replace("lilaIpoLemma:","http://lila-erc.eu/data/id/hypolemma/")
                    .replace("\"spaceAfter\": \"\"","\"spaceAfter\": \"NO\"")
                    .replace("\"spaceAfter\": \" \"","\"spaceAfter\": \"YES\"")
                    .replace("\"spaceAfter\": \"\\n\"","\"spaceAfter\": \"NO\"")
            );

    }
}
