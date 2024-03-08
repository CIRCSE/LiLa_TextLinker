package utils;

import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.annotation.Nullable;

public class Network {
    synchronized public static String request(String requestURL, @Nullable Map<String, String> postMap)
            throws IOException {

        HttpRequestBase request;

        CloseableHttpClient httpClient = HttpClientBuilder.create().build();

        if (postMap == null) {
            request = new HttpGet(requestURL);
        } else {
            request = new HttpPost(requestURL);

            List<NameValuePair> nvps = new ArrayList<>();
            for (String key : postMap.keySet()) {
                nvps.add(new BasicNameValuePair(key, postMap.get(key)));

            }

            ((HttpPost) request).setEntity(new UrlEncodedFormEntity(nvps, "UTF-8"));
        }

        CloseableHttpResponse response = httpClient.execute(request);

        BufferedReader in = new BufferedReader(
                new InputStreamReader(response.getEntity().getContent(), "UTF-8"));
        String inputLine;
        StringBuilder a = new StringBuilder();
        while ((inputLine = in.readLine()) != null) {
            a.append(inputLine);
        }
        in.close();
        return a.toString();

    }

}
