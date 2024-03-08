package servlet;

import com.google.common.collect.Multimap;
import com.google.gson.*;
import utils.CollectLemmaBank;
import utils.Network;
import utils.conllu.ConllFile;
import utils.conllu.ConllSentence;
import utils.conllu.ConllWord;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet(name = "process", value = "/process")
public class precess extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        String text = request.getParameter("text");




        if (text == null || text.trim().length() == 0){
            out.write("No input text");
            return;
        }

        if (text.startsWith("https://beta-switchboard.clarin.eu/api/storage")){

            URL url = new URL(text);
            BufferedReader read = new BufferedReader(
                    new InputStreamReader(url.openStream(), StandardCharsets.UTF_8));
            if (read != null) {
                String i;
                StringBuffer doc = new StringBuffer();
                while ((i = read.readLine()) != null) {
                    doc.append(i + System.lineSeparator());
                }
                text= doc.toString();
            }



        }


        Multimap<String, Integer> lemmas = CollectLemmaBank.getLemmas();
        Multimap<String, Integer> ipoLemmas = CollectLemmaBank.getIpoLemmas();
//        Multimap<String, Integer> lemmas = (Multimap) request.getServletContext().getAttribute("lemmas");
//        Multimap<String, Integer> ipoLemmas = (Multimap) request.getServletContext().getAttribute("ipolemmas");


        Map<String, String> data = new HashMap<>();
        data.put("data", text.replace("[","[ ").replace("]"," ]").replace("\""," \" ").replace("'"," ' "));
        data.put("tokenizer", "1");
        data.put("tagger", "1");
        URL url = new URL("http", "127.0.0.1", 50020, "/process");



        JsonObject udpipeResponseJson= null;
        try {
            String resp = Network.request(url.toString(), data);
            udpipeResponseJson = JsonParser.parseString(resp).getAsJsonObject();
        }catch (Exception e){
//            out.write("An error occurred");
        }



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

                    String toMatchLemma = w.getLemma().toLowerCase().replace("v","u").replace("j","i") + "_" + w.getUpostag();

                    if (cachedLinkedLamma.containsKey(toMatchLemma)){
                        linking = cachedLinkedLamma.get(toMatchLemma);
                    }else{
                        if (lemmas.containsKey(toMatchLemma)) {
                            for (Integer lid : lemmas.get(toMatchLemma)) {
                                linking.add("http://lila-erc.eu/data/id/lemma/" + lid);
                            }
                        }

                        if (ipoLemmas.containsKey(toMatchLemma)) {
                            for (Integer lid : ipoLemmas.get(toMatchLemma)) {
                                linking.add("http://lila-erc.eu/data/id/hypolemma/" + lid);
                            }
                        }
                        cachedLinkedLamma.putIfAbsent(toMatchLemma,linking);
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

            for (JsonElement se :sentencesArray){
                JsonArray s = se.getAsJsonArray();
                for (JsonElement te :s){
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
            stats.addProperty("direct",direct);
            stats.addProperty("ambiguous",ambiguous);
            stats.addProperty("missing",missing);


//            stats.addProperty("total",(missing+direct+ambiguous));

            results.add("stats", stats);


        } catch (Exception e) {
            out.write("An error occurred");
        }
        Gson gson = new GsonBuilder().setPrettyPrinting().create();

        out.write(gson.toJson(results));
    }


}
