package com.certifypro.service;

import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;

/**
 * Service interface for file storage operations
 */
public interface StorageService {

    /**
     * Upload a file to storage
     * 
     * @param file   The file to upload
     * @param folder The folder/prefix to store the file in
     * @return The public URL of the uploaded file
     */
    String uploadFile(MultipartFile file, String folder);

    /**
     * Delete a file from storage
     * 
     * @param fileUrl The URL of the file to delete
     */
    void deleteFile(String fileUrl);

    /**
     * Generate a presigned URL for temporary access to a file
     * 
     * @param fileKey    The S3 key of the file
     * @param expiration Duration until the URL expires
     * @return The presigned URL
     */
    String generatePresignedUrl(String fileKey, Duration expiration);

    /**
     * Extract the file key from a full S3 URL
     * 
     * @param fileUrl The full S3 URL
     * @return The file key
     */
    String extractFileKey(String fileUrl);
}
