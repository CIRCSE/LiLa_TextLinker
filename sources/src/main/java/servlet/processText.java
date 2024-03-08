package servlet;


import com.google.common.collect.Multimap;
import com.google.gson.*;
import utils.CollectLemmaBank;
import utils.Network;
import utils.conllu.ConllFile;
import utils.conllu.ConllSentence;
import utils.conllu.ConllWord;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/processText")
public class processText extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

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
        //System.out.println("here "+params);
        Multimap<String, Integer> lemmas = CollectLemmaBank.getLemmas();
        Multimap<String, Integer> ipoLemmas = CollectLemmaBank.getIpoLemmas();
//        Multimap<String, Integer> lemmas = (Multimap) request.getServletContext().getAttribute("lemmas");
//        Multimap<String, Integer> ipoLemmas = (Multimap) request.getServletContext().getAttribute("ipolemmas");


        Map<String, String> data = new HashMap<>();
        data.put("data", params.get("text").getAsString().replace("[", "[ ").replace("]", " ]").replace("\"", " \" ").replace("'", " ' "));
        data.put("tokenizer", "1");
        data.put("tagger", "1");
        URL url = new URL("http", "127.0.0.1", 50020, "/process");


        String resp = Network.request(url.toString(), data);
        JsonObject udpipeResponseJson = JsonParser.parseString(resp).getAsJsonObject();


        JsonObject results = new JsonObject();
        JsonArray sentencesArray = new JsonArray();


        try {
            ConllFile f = new ConllFile(udpipeResponseJson.get("result").getAsString());
            List<ConllSentence> sentences = f.getSentences();

            Map<String, JsonArray> cachedLinkedLamma = new HashMap<>();

            for (ConllSentence s : sentences) {
                JsonArray sentence = new JsonArray();
                for (ConllWord w : s.getWords()) {
                    JsonObject token = new JsonObject();
                    JsonArray linking = new JsonArray();
                    token.addProperty("token", w.getForm());
                    token.addProperty("lemma", w.getLemma());
                    token.addProperty("upos", w.getUpostag());
                    token.addProperty("spaceAfter", w.getSpacesAfter());

                    String toMatchLemma = w.getLemma().toLowerCase().replace("v", "u").replace("j", "i") + "_" + w.getUpostag();

                    if (cachedLinkedLamma.containsKey(toMatchLemma)) {
                        linking = cachedLinkedLamma.get(toMatchLemma);
                    } else {
                        if (lemmas.containsKey(toMatchLemma)) {
                            for (Integer lid : lemmas.get(toMatchLemma)) {
                                linking.add("lilaLemma:" + lid);
                            }
                        }

                        if (ipoLemmas.containsKey(toMatchLemma)) {
                            for (Integer lid : ipoLemmas.get(toMatchLemma)) {
                                linking.add("lilaIpoLemma:" + lid);
                            }
                        }
                        cachedLinkedLamma.putIfAbsent(toMatchLemma, linking);
                    }


                    token.add("linking", linking);
                    sentence.add(token);
                }
                sentencesArray.add(sentence);
            }
            results.add("sentences", sentencesArray);

            Integer missing = 0;
            Integer direct = 0;
            Integer ambiguous = 0;

            for (JsonElement se : sentencesArray) {
                JsonArray s = se.getAsJsonArray();
                for (JsonElement te : s) {
                    JsonObject t = te.getAsJsonObject();
                    if (!t.get("upos").getAsString().equals("PUNCT") && !t.get("upos").getAsString().equals("SYM") && !t.get("upos").getAsString().equals("NUM") && !t.get("upos").getAsString().equals("X")) {
                        if (t.get("linking").getAsJsonArray().size() == 0) {
                            missing++;
                        } else if (t.get("linking").getAsJsonArray().size() == 1) {
                            direct++;
                        } else if (t.get("linking").getAsJsonArray().size() > 1) {
                            ambiguous++;
                        }
                    }

                }
            }

//            for (Map.Entry<String,JsonArray> entry : cachedLinkedLamma.entrySet()){
//                if (!entry.getKey().endsWith("_PUNCT") && !entry.getKey().endsWith("_SYM") && !entry.getKey().endsWith("_NUM") && !entry.getKey().endsWith("_X")) {
//                    if (entry.getValue().size() == 0){
//                        missing ++;
//                    }else if (entry.getValue().size() == 1){
//                        direct ++;
//                    }else if (entry.getValue().size() > 1){
//                        ambiguous ++;
//                    }
//                }
//            }

            JsonObject stats = new JsonObject();
            stats.addProperty("direct", direct);
            stats.addProperty("ambiguous", ambiguous);
            stats.addProperty("missing", missing);


//            stats.addProperty("total",(missing+direct+ambiguous));

            results.add("stats", stats);


        } catch (Exception e) {
            e.printStackTrace();
        }

        out.write(results.toString());
    }


}
