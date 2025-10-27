package com.websystem.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.websystem.config.SupabaseConfig;
import com.websystem.model.DataRecord;
import com.websystem.model.User;
import okhttp3.*;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

@Service
public class SupabaseService {
    private final OkHttpClient client = new OkHttpClient();
    private final Gson gson = new Gson();
    private final SupabaseConfig config;

    public SupabaseService(SupabaseConfig config) {
        this.config = config;
    }

    private String md5Hash(String input) {
        return DigestUtils.md5Hex(input);
    }

    public String registerUser(String login, String password) throws IOException {
        String hashedPassword = md5Hash(password);
        
        JsonObject userJson = new JsonObject();
        userJson.addProperty("login", login);
        userJson.addProperty("hashed_password", hashedPassword);

        RequestBody body = RequestBody.create(
            userJson.toString(),
            MediaType.parse("application/json")
        );

        Request request = new Request.Builder()
            .url(config.getSupabaseUrl() + "/rest/v1/users")
            .addHeader("apikey", config.getSupabaseKey())
            .addHeader("Authorization", "Bearer " + config.getSupabaseKey())
            .addHeader("Content-Type", "application/json")
            .addHeader("Prefer", "return=minimal")
            .post(body)
            .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "Unknown error";
                throw new IOException("Registration failed: " + errorBody);
            }
            return "User registered successfully";
        }
    }

    public User loginUser(String login, String password) throws IOException {
        String hashedPassword = md5Hash(password);
        
        Request request = new Request.Builder()
            .url(config.getSupabaseUrl() + "/rest/v1/users?login=eq." + login + "&hashed_password=eq." + hashedPassword)
            .addHeader("apikey", config.getSupabaseKey())
            .addHeader("Authorization", "Bearer " + config.getSupabaseKey())
            .get()
            .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Login failed");
            }
            
            String responseBody = response.body().string();
            JsonArray users = gson.fromJson(responseBody, JsonArray.class);
            
            if (users.size() == 0) {
                return null;
            }
            
            JsonObject userJson = users.get(0).getAsJsonObject();
            User user = new User();
            user.setId(userJson.get("id").getAsString());
            user.setLogin(userJson.get("login").getAsString());
            return user;
        }
    }

    public List<DataRecord> getAllData() throws IOException {
        Request request = new Request.Builder()
            .url(config.getSupabaseUrl() + "/rest/v1/data?select=*")
            .addHeader("apikey", config.getSupabaseKey())
            .addHeader("Authorization", "Bearer " + config.getSupabaseKey())
            .get()
            .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Failed to get data");
            }
            
            String responseBody = response.body().string();
            JsonArray dataArray = gson.fromJson(responseBody, JsonArray.class);
            List<DataRecord> records = new ArrayList<>();
            
            for (JsonElement element : dataArray) {
                JsonObject obj = element.getAsJsonObject();
                DataRecord record = new DataRecord();
                record.setId(obj.get("id").getAsString());
                record.setContent(obj.get("content").getAsString());
                if (obj.has("user_id") && !obj.get("user_id").isJsonNull()) {
                    record.setUserId(obj.get("user_id").getAsString());
                }
                records.add(record);
            }
            
            return records;
        }
    }

    public String addData(String content, String userId) throws IOException {
        JsonObject dataJson = new JsonObject();
        dataJson.addProperty("content", content);
        dataJson.addProperty("user_id", userId);

        RequestBody body = RequestBody.create(
            dataJson.toString(),
            MediaType.parse("application/json")
        );

        Request request = new Request.Builder()
            .url(config.getSupabaseUrl() + "/rest/v1/data")
            .addHeader("apikey", config.getSupabaseKey())
            .addHeader("Authorization", "Bearer " + config.getSupabaseKey())
            .addHeader("Content-Type", "application/json")
            .addHeader("Prefer", "return=minimal")
            .post(body)
            .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "Unknown error";
                throw new IOException("Failed to add data: " + errorBody);
            }
            return "Record added successfully";
        }
    }

    public String updateData(String id, String content) throws IOException {
        JsonObject dataJson = new JsonObject();
        dataJson.addProperty("content", content);

        RequestBody body = RequestBody.create(
            dataJson.toString(),
            MediaType.parse("application/json")
        );

        Request request = new Request.Builder()
            .url(config.getSupabaseUrl() + "/rest/v1/data?id=eq." + id)
            .addHeader("apikey", config.getSupabaseKey())
            .addHeader("Authorization", "Bearer " + config.getSupabaseKey())
            .addHeader("Content-Type", "application/json")
            .addHeader("Prefer", "return=minimal")
            .patch(body)
            .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "Unknown error";
                throw new IOException("Failed to update data: " + errorBody);
            }
            return "Record updated successfully";
        }
    }

    public String deleteData(String id) throws IOException {
        Request request = new Request.Builder()
            .url(config.getSupabaseUrl() + "/rest/v1/data?id=eq." + id)
            .addHeader("apikey", config.getSupabaseKey())
            .addHeader("Authorization", "Bearer " + config.getSupabaseKey())
            .delete()
            .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "Unknown error";
                throw new IOException("Failed to delete data: " + errorBody);
            }
            return "Record deleted successfully";
        }
    }
}
