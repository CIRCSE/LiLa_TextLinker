import {executeSparql} from "./Sparql";

export const listOfPrefix = [
    {prefix: "lilaLemma:" ,uri:"http://lila-erc.eu/data/id/lemma/"},
    {prefix: "lilaIpoLemma:" ,uri:"http://lila-erc.eu/data/id/hypolemma/"},
    {prefix: "lila:" ,uri:"http://lila-erc.eu/ontologies/lila/"},
    {prefix: "ontolex:" ,uri:"http://www.w3.org/ns/lemon/ontolex#"},
    {prefix: "rdf:" ,uri:"http://www.w3.org/1999/02/22-rdf-syntax-ns#"},
    {prefix: "rdfs:" ,uri:"http://www.w3.org/2000/01/rdf-schema#"},
    {prefix: "dcterms:" ,uri:"http://purl.org/dc/terms/"},
]

export function translatePrefix(String){
    let out = String
    listOfPrefix.forEach(object => {
        if (String.startsWith(object.prefix)){
            out = String.replace(object.prefix,object.uri)

        }else if(String.startsWith(object.uri)){
            out = String.replace(object.uri,object.prefix)
        }
    })
    return out
}

export function getLabel (uri,endpoint, callback){

        let query = "Prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
            "SELECT *\n" +
            "WHERE {\n" +
            "  <" + uri + "> rdfs:label ?object\n" +
            "}"
        executeSparql(query, endpoint ,(data) => {
            let res = uri
            if(data.length>0){
              //  console.log(data[0].object);
                res = data[0].object
            }
            callback(res)

        })

}

export function getLatinAffectusPolarity(lexicalEntry){
    return "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
        "PREFIX ontolex: <http://www.w3.org/ns/lemon/ontolex#>\n" +
        "PREFIX marl: <http://www.gsi.dit.upm.es/ontologies/marl/ns#>\n" +
        "\n" +
        "SELECT ?polarityValue ?polarity WHERE {\n" +
        "\t<"+lexicalEntry+"> ontolex:sense ?sense .\n" +
        "  \t?sense marl:polarityValue ?polarityValue;\n" +
        "          marl:hasPolarity ?polarityObj.\n" +
        "  \t?polarityObj rdfs:label ?polarity\n" +
        "} "
}


export function getEtymonQuery(lexicalEntry){
    return "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
        "PREFIX lime: <http://www.w3.org/ns/lemon/lime#>\n" +
        "PREFIX lemonEty: <http://lari-datasets.ilc.cnr.it/lemonEty#>\n" +
        "PREFIX ontolex: <http://www.w3.org/ns/lemon/ontolex#>\n" +
        "PREFIX lilaLemma: <http://lila-erc.eu/data/id/lemma/>\n" +
        "PREFIX lilaIpoLemma: <http://lila-erc.eu/data/id/hypolemma/>\n" +
        "\n" +
        "SELECT  ?etymon ?etymonLanguage ?cognateLemma WHERE {\n" +
        "  \tBIND(<"+lexicalEntry+"> AS ?le)\n" +
        "\t{?le lemonEty:etymology ?etymology .\n" +
        "  \t?etymology lemonEty:etymon ?ety.\n" +
        "  \t?ety lime:language ?etymonLanguage;\n" +
        "        rdfs:label ?etymon.}\n" +
        "  \tUNION{\n" +
        "      ?le lemonEty:cognate ?cognate .\n" +
        "      ?cognate lemonEty:etymology ?etymologyCog .\n" +
        "\t  ?cognate ontolex:canonicalForm ?cognateLemma .   \n" +
        "      ?etymologyCog lemonEty:etymon ?etyCog .\n" +
        "      ?etyCog lime:language ?etymonLanguage;\n" +
        "                 rdfs:label ?etymon.\n" +
        "  \t}\n" +
        "} "
}

export function getIGVLLQuery(lexicalEntry){
    return "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
        "PREFIX ontolex: <http://www.w3.org/ns/lemon/ontolex#>\n" +
        "PREFIX lemonEty: <http://lari-datasets.ilc.cnr.it/lemonEty#>\n" +
        "PREFIX crminf: <http://new.cidoc-crm.org/crminf/>\n" +
        "SELECT ?etymology ?belief ?etymo ?cognate (GROUP_CONCAT(DISTINCT ?subtermsLabel ; separator=\" \") as ?subterms)  WHERE {\n" +
        "\t<"+lexicalEntry+"> lemonEty:etymology ?etymology .\n" +
        "  \t?etymology lemonEty:etymon ?etymon .\n" +
        "  OPTIONAL {\n" +
        "  \t?beliefcrm crminf:J4 ?etymology;\n" +
        "           rdfs:label ?belief.\n" +
        "  }\n" +
        "  \t?etymon rdfs:label ?etymo.\n" +
        "  OPTIONAL {\n" +
        "    ?etymon lemonEty:cognate ?cogn.\n" +
        "    ?cogn rdfs:label ?cognate\n" +
        "  }\n" +
        "  OPTIONAL{\n" +
        "  \t?etymon <decomp:subterm> ?subs.\n" +
        "    ?subs rdfs:label ?subtermsLabel\n" +
        "  }\n" +
        "  \n" +
        "}group by ?etymology ?belief ?etymo ?cognate\n" +
        "\n" +
        "\n"
}


export function getLexiconsQuery (lemma) {
    return "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
        "PREFIX lime: <http://www.w3.org/ns/lemon/lime#>\n" +
        "PREFIX lilaLemma: <http://lila-erc.eu/data/id/lemma/>\n" +
        "PREFIX lilaIpoLemma: <http://lila-erc.eu/data/id/hypolemma/>\n" +
        "\n" +
        "SELECT * WHERE {\n" +
        "  ?lexicalEntry ?pred "+lemma+" .\n" +
        "  ?lexicon lime:entry ?lexicalEntry    \n" +
        "} "
}


export function getLatinWordnetQuery (lexicalEntry){
    return "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
        "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
        "prefix ontolex: <http://www.w3.org/ns/lemon/ontolex#>\n" +
        "prefix skos: <http://www.w3.org/2004/02/skos/core#>\n" +
        "prefix wn: <http://wordnet-rdf.princeton.edu/ontology#>\n" +
        "\n" +
        "SELECT *\n" +
        "{\n" +
        "\t<"+lexicalEntry+"> ontolex:sense ?sense.\n" +
        "  \t?sense ontolex:isLexicalizedSenseOf ?synLink.\n" +
        "    ?synLink skos:definition ?def.\n" +
        "  \tOPTIONAL {\n" +
        "      ?pT rdfs:subPropertyOf wn:link .\n" +
        "      ?pT rdfs:label ?pTLabel.\n" +
        "      ?synLink ?pT ?relSyn.\n" +
        "      ?relSyn skos:definition ?defRel.\n" +
        "  \t}\n" +
        "}"
}


export function getLemmaStartingWith (string) {

    return "PREFIX lilaLemma: <http://lila-erc.eu/data/id/lemma/>\n" +
        "PREFIX lilaIpoLemma: <http://lila-erc.eu/data/id/hypolemma/>\n" +
        "PREFIX ontolex: <http://www.w3.org/ns/lemon/ontolex#>\n" +
        "PREFIX lila: <http://lila-erc.eu/ontologies/lila/>\n" +
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
        "\n" +
        "SELECT ?subject ?poslink ?pos (group_concat(distinct ?wr;\n" +
        "    separator=\" \") as ?wrs) WHERE { \n" +
        "  ?subject ontolex:writtenRep ?object ;\n" +
        "           lila:hasPOS ?poslink . \n" +
        "  ?poslink rdfs:label ?pos .\n" +
        "  ?subject ontolex:writtenRep ?wr .\n" +
        "  FILTER regex(?object, \"^"+string+"\",\"i\")\n" +
        "} \n" +
        "GROUP BY  ?subject ?poslink ?pos\n" +
        "ORDER BY ?wrs "
}



export function getLemmaBankQuery (lemma) {

    return "Prefix lilaLemma: <http://lila-erc.eu/data/id/lemma/>\n" +
    "Prefix lilaIpoLemma: <http://lila-erc.eu/data/id/hypolemma/>\n" +
    "Prefix lila: <http://lila-erc.eu/ontologies/lila/>\n" +
    "Prefix ontolex: <http://www.w3.org/ns/lemon/ontolex#>\n" +
    "Prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
    "Prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
    "SELECT *\n" +
    "WHERE {\n" +
    "  "+lemma+" ?predicate ?object\n" +
    "}"
}


export function getLewisShortQuery (subject){
    return "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
        "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
        "PREFIX lime: <http://www.w3.org/ns/lemon/lime#>\n" +
        "prefix ontolex: <http://www.w3.org/ns/lemon/ontolex#>\n" +
        "prefix skos: <http://www.w3.org/2004/02/skos#>\n" +
        "prefix wn: <http://wordnet-rdf.princeton.edu/ontology#>\n" +
        "prefix premon: <http://premon.fbk.eu/ontology/core#>\n" +
        "prefix lv: <http://lila-erc.eu/ontologies/latinVallex/>\n" +
        "\n" +
        "SELECT *\n" +
        "{\n" +
        " VALUES ?le { <"+subject+">} \n" +
        "    \n" +
        " ?le rdfs:label ?leLabel .\n" +
        "  \n" +
        " \t\t?le    ontolex:sense ?defs.\n" +
        "  \t\t?defs skos:definition ?defsString  .\n" +
        "}order by ?defs"
}
