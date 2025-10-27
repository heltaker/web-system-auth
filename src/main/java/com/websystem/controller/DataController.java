package com.websystem.controller;

import com.websystem.model.DataRecord;
import com.websystem.service.SupabaseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/data")
public class DataController {
    private final SupabaseService supabaseService;

    public DataController(SupabaseService supabaseService) {
        this.supabaseService = supabaseService;
    }

    @GetMapping
    public ResponseEntity<?> getAllData() {
        try {
            List<DataRecord> data = supabaseService.getAllData();
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> addData(@RequestBody Map<String, String> body) {
        Map<String, String> response = new HashMap<>();
        try {
            String content = body.get("content");
            String userId = body.get("user_id");
            
            if (content == null || content.trim().isEmpty()) {
                response.put("error", "Content is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            String message = supabaseService.addData(content, userId);
            response.put("message", message);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, String>> updateData(@PathVariable String id, @RequestBody Map<String, String> body) {
        Map<String, String> response = new HashMap<>();
        try {
            String content = body.get("content");
            
            if (content == null || content.trim().isEmpty()) {
                response.put("error", "Content is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            String message = supabaseService.updateData(id, content);
            response.put("message", message);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteData(@PathVariable String id) {
        Map<String, String> response = new HashMap<>();
        try {
            String message = supabaseService.deleteData(id);
            response.put("message", message);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
