package utils;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import org.apache.commons.lang3.tuple.MutablePair;
import org.eclipse.rdf4j.model.Model;
import org.eclipse.rdf4j.model.ValueFactory;
import org.eclipse.rdf4j.model.impl.SimpleValueFactory;
import org.eclipse.rdf4j.model.util.ModelBuilder;
import org.eclipse.rdf4j.model.vocabulary.DC;
import org.eclipse.rdf4j.model.vocabulary.DCTERMS;
import org.eclipse.rdf4j.model.vocabulary.RDF;
import org.eclipse.rdf4j.model.vocabulary.RDFS;
import org.eclipse.rdf4j.rio.RDFFormat;
import org.eclipse.rdf4j.rio.Rio;

import java.io.ByteArrayOutputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.util.UUID;

public class TTLFunctions {

    public static MutablePair<String,StringBuffer> generateTTL(JsonObject params){
        StringBuffer out = new StringBuffer();
        String documentURIExtended = "";
        try {
            JsonArray sentencesOfText = params.get("textToProcess").getAsJsonArray();
            JsonObject formData = params.get("formData").getAsJsonObject();
            String documentTile = formData.get("documentTitle").getAsString();
            String documentDescription = formData.get("documentDescription").getAsString();
            String documentPublisher = formData.get("documentPublisher").getAsString();
            String documentAuthor = formData.get("documentAuthor").getAsString();
            String sessionId = formData.get("sessionId").getAsString();
            String documentNamespace = "http://lila-erc.eu/data/corpora/";


            String encodeTitle = URLEncoder.encode(documentTile.replace(" ", "_"), StandardCharsets.UTF_8.toString());


           // Timestamp timestamp = new Timestamp(System.currentTimeMillis());

            //Starting LOD data


            ModelBuilder builder = new ModelBuilder();
            builder.setNamespace("ontolex", "http://www.w3.org/ns/lemon/ontolex#");
            builder.setNamespace("powla", "http://purl.org/powla/powla.owl#");
            builder.setNamespace("rdfs", "http://www.w3.org/2000/01/rdf-schema#");
            builder.setNamespace("documentNamespace", documentNamespace + encodeTitle + "_" + sessionId + "/");
            builder.setNamespace("lila_corpus", "http://lila-erc.eu/ontologies/lila_corpora/");
            builder.setNamespace("lila_authors", "http://lila-erc.eu/data/corpora/id/authors/");
            builder.setNamespace("lilaLemma", "http://lila-erc.eu/data/id/lemma/");
            builder.setNamespace("lilaIpoLemma", "http://lila-erc.eu/data/id/hypolemma/");
            builder.setNamespace("lilaOntology", "http://lila-erc.eu/ontologies/lila/");
            builder.setNamespace("dc", "http://purl.org/dc/elements/1.1/");
            builder.setNamespace("dcterm", "http://purl.org/dc/terms/");
            builder.setNamespace("owl", "http://www.w3.org/2002/07/owl#");
            Model model = builder.build();

            ValueFactory factory = SimpleValueFactory.getInstance();
            String checksumMD5 = UUID.randomUUID().toString();

            String documentURI = "documentNamespace:id/citationUnit/" + encodeTitle;
            documentURIExtended = documentNamespace + encodeTitle + "_" + sessionId + "/"+"id/citationUnit/" + encodeTitle;
            builder.subject(documentURI)
                    .add(RDF.TYPE, "powla:Document")
                    .add(RDF.TYPE, "owl:NamedIndividual")
                    .add(DC.TITLE, documentTile)
                    .add(DCTERMS.CREATOR, documentAuthor.trim().startsWith("http") ? factory.createIRI(documentAuthor.trim()) : documentAuthor.trim())
                    .add(DC.DESCRIPTION, documentDescription)
                    .add(RDFS.LABEL, documentTile)
                    .add(DCTERMS.PUBLISHER, documentPublisher.trim().startsWith("http") ? factory.createIRI(documentPublisher.trim()) : documentPublisher.trim())
                    .add(DCTERMS.LICENSE, factory.createIRI("http://www.wikidata.org/entity/Q42553662"));


            String documentLayerURI = documentURI + "/DocumentLayer";
            builder.subject(documentLayerURI)
                    .add(RDF.TYPE, "powla:DocumentLayer")
                    .add(RDF.TYPE, "owl:NamedIndividual")
                    .add(DC.TITLE, "Document Layer")
                    .add(DC.DESCRIPTION, documentTile + " Document Layer")
                    .add("powla:hasDocument", documentURI);

            String citationStructureURI = documentURI + "/CiteStructure";
            builder.subject(citationStructureURI)
                    .add(RDF.TYPE, "lila_corpus:CitationStructure")
                    .add(RDF.TYPE, "owl:NamedIndividual")
                    .add(DC.TITLE, "Citation Layer")
                    .add(DC.DESCRIPTION, documentTile + " Citation Layer")
                    .add("powla:hasDocument", documentURI);

            for (int i = 0; i < sentencesOfText.size(); i++) {
                String sId = "s-" + (i + 1);
                String sentenceURI = citationStructureURI + "/" + sId;

                // sentence generation
                builder.subject(citationStructureURI + "/" + sId)
                        .add(RDF.TYPE, "lila_corpus:citationUnit")
                        .add(RDF.TYPE, "owl:NamedIndividual")
                        .add(RDFS.LABEL, "Sentence " + (i + 1))
                        .add("lila_corpus:hasRefType", "Sentence")
                        .add("lila_corpus:hasCitLevel", 1);
                //.add("lila_corpus:hasRefValue", Integer.parseInt(parserdId.getValue1().getValue1().replaceAll("\\D+", "")));


                builder.subject(citationStructureURI)
                        .add("lila_corpus:isLayer", sentenceURI);

                if (i == 0) {

                    builder.subject(citationStructureURI)
                            .add("lila_corpus:first", sentenceURI);
                }
                if (i == (sentencesOfText.size() - 1)) {
                    builder.subject(citationStructureURI)
                            .add("lila_corpus:last", sentenceURI);
                }

                if (sentencesOfText.size() > 1) {
                    if (i == 0) {
                        builder.subject(sentenceURI)
                                .add("powla:next", citationStructureURI + "/s-" + (i + 2));
                    } else if (i == (sentencesOfText.size() - 1)) {
                        builder.subject(sentenceURI)
                                .add("powla:previous", citationStructureURI + "/s-" + (i));
                    } else {
                        builder.subject(sentenceURI)
                                .add("powla:previous", citationStructureURI + "/s-" + (i));
                        builder.subject(sentenceURI)
                                .add("powla:next", citationStructureURI + "/s-" + (i + 2));
                    }
                }
                // end sentence

                // tokens process

                JsonArray tokenArray = sentencesOfText.get(i).getAsJsonArray();
                for (int j = 0; j < tokenArray.size(); j++) {

                    JsonObject token = tokenArray.get(j).getAsJsonObject();
                    String tokenId = "t-" + (j + 1);
                    String tokenNamespace = sentenceURI + "/" + tokenId;


                    String tokenString = token.get("token").getAsString();


                    builder.subject(tokenNamespace)
                            .add(RDF.TYPE, "powla:Terminal")
                            .add(RDFS.LABEL, tokenString)
                            .add("powla:hasStringValue", tokenString)
//                            .add("lila_corpus:hasCitStructure", citationStructureURI);
                            .add("powla:hasLayer", documentLayerURI);


                    for (JsonElement lemmaLinkElement : token.get("linking").getAsJsonArray()) {
                        String lemmaLink = lemmaLinkElement.getAsString();
                        builder.add("lilaOntology:hasLemma", lemmaLink);
                    }

                    builder.subject(sentenceURI)
                            .add("powla:hasChild", tokenNamespace);


                    if (tokenArray.size() > 1) {
                        if (j == 0) {
                            builder.subject(sentenceURI)
                                    .add("lila_corpus:first", tokenNamespace);
                            builder.subject(tokenNamespace)
                                    .add("powla:next", sentenceURI + "/t-" + (j + 2));
                        } else if (j == (tokenArray.size() - 1)) {
                            builder.subject(sentenceURI)
                                    .add("lila_corpus:last", tokenNamespace);
                            builder.subject(tokenNamespace)
                                    .add("powla:previous", sentenceURI + "/t-" + (j));
                        } else {
                            builder.subject(tokenNamespace)
                                    .add("powla:previous", sentenceURI + "/t-" + (j));
                            builder.subject(tokenNamespace)
                                    .add("powla:next", sentenceURI + "/t-" + (j + 2));
                        }
                    }


                }
            }

            ByteArrayOutputStream stream = new ByteArrayOutputStream();
            model = builder.build();
            Rio.write(model, stream, RDFFormat.TURTLE);
            stream.flush();
            out.append(new String(stream.toByteArray()));
        }catch (Exception e){

        }
        return new MutablePair<>(documentURIExtended,out);
    }

}
