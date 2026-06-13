package com.mungnyang.backend.naver.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mungnyang.backend.naver.dto.NaverPlaceResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class NaverLocalService {

    @Value("${naver.client-id}")
    private String clientId;

    @Value("${naver.client-secret}")
    private String clientSecret;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<NaverPlaceResponse> searchLocal(String query) {
        try {
            String urlString = UriComponentsBuilder
                    .fromHttpUrl("https://openapi.naver.com/v1/search/local.json")
                    .queryParam("query", query)
                    .queryParam("display", 20)
                    .queryParam("start", 1)
                    .queryParam("sort", "comment")
                    .build()
                    .encode(StandardCharsets.UTF_8)
                    .toUriString();

            URL url = new URL(urlString);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            connection.setRequestMethod("GET");
            connection.setRequestProperty("X-Naver-Client-Id", clientId);
            connection.setRequestProperty("X-Naver-Client-Secret", clientSecret);
            connection.setRequestProperty("Accept", "application/json");

            int statusCode = connection.getResponseCode();

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(
                            statusCode >= 200 && statusCode < 300
                                    ? connection.getInputStream()
                                    : connection.getErrorStream(),
                            StandardCharsets.UTF_8
                    )
            );

            StringBuilder responseBody = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                responseBody.append(line);
            }

            reader.close();

            System.out.println("===== NAVER LOCAL STATUS =====");
            System.out.println(statusCode);
            System.out.println("===== NAVER LOCAL RESPONSE =====");
            System.out.println(responseBody);

            if (statusCode < 200 || statusCode >= 300) {
                return List.of();
            }

            JsonNode root = objectMapper.readTree(responseBody.toString());
            JsonNode items = root.path("items");

            List<NaverPlaceResponse> results = new ArrayList<>();

            for (JsonNode item : items) {
                results.add(
                        NaverPlaceResponse.builder()
                                .title(cleanHtml(item.path("title").asText()))
                                .address(item.path("address").asText())
                                .roadAddress(item.path("roadAddress").asText())
                                .category(item.path("category").asText())
                                .link(item.path("link").asText())
                                .description(cleanHtml(item.path("description").asText()))
                                .mapx(item.path("mapx").asText())
                                .mapy(item.path("mapy").asText())
                                .build()
                );
            }

            return results;

        } catch (Exception e) {
            System.out.println("===== NAVER LOCAL ERROR =====");
            e.printStackTrace();
            return List.of();
        }
    }

    private String cleanHtml(String text) {
        if (text == null) return "";

        return text
                .replaceAll("<[^>]*>", "")
                .replace("&amp;", "&")
                .replace("&lt;", "<")
                .replace("&gt;", ">");
    }
}