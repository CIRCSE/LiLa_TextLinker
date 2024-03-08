import $ from "jquery";
import * as Papa from 'papaparse';


// url: 'http://lila-erc.eu:8080/LiLaSparqlAccessPoint/lila_knowledge_base/query?format=csv&query=' + encodeURIComponent(query),
// url: 'https://lila-erc.eu/sparql/'+endpoint+'/query?format=csv&query=' + encodeURIComponent(query),

export function executeSparql(query,endpoint, callback) {
    $.ajax({
        url: 'https://lila-erc.eu/sparql/lila_knowledge_base/query?format=csv&query=' + encodeURIComponent(query),
        async: true,
        dataType: "text",
        success: function (data) {
            let results = Papa.parse(data, {header: true, skipEmptyLines: true});



            //console.log(results.data);
            //
            // data.results.bindings.forEach((elem) =>{
            //
            //     let result = {}
            //     fields.forEach((field) => {
            //         if (elem.hasOwnProperty(field)){
            //             result[field] = elem[field].value
            //         }
            //     })
            //     results.push(result)
            // })
            callback(results.data)
            //callback(results)
        }

    });
}
