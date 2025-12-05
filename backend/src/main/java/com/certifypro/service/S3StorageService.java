package com.certifypro.service;

import com.certifypro.config.S3Config;
import com.certifypro.exception.FileStorageException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3StorageService implements StorageService {

    private final S3Client s3Client;
    private final S3Config s3Config;

    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/webp");

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    @Override
    public String uploadFile(MultipartFile file, String folder) {
        validateFile(file);

        String fileName = generateFileName(file.getOriginalFilename());
        String fileKey = folder + "/" + fileName;

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(s3Config.getBucketName())
                    .key(fileKey)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));

            String fileUrl = String.format("https://%s.s3.%s.amazonaws.com/%s",
                    s3Config.getBucketName(),
                    s3Config.getRegion(),
                    fileKey);

            log.info("File uploaded successfully: {}", fileUrl);
            return fileUrl;

        } catch (IOException e) {
            log.error("Failed to upload file: {}", e.getMessage());
            throw new FileStorageException("Failed to upload file: " + e.getMessage());
        } catch (S3Exception e) {
            log.error("S3 error while uploading file: {}", e.getMessage());
            throw new FileStorageException("S3 error: " + e.awsErrorDetails().errorMessage());
        }
    }

    @Override
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return;
        }

        try {
            String fileKey = extractFileKey(fileUrl);

            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(s3Config.getBucketName())
                    .key(fileKey)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);
            log.info("File deleted successfully: {}", fileKey);

        } catch (S3Exception e) {
            log.error("S3 error while deleting file: {}", e.getMessage());
            throw new FileStorageException("Failed to delete file: " + e.awsErrorDetails().errorMessage());
        }
    }

    @Override
    public String generatePresignedUrl(String fileKey, Duration expiration) {
        // Presigned URLs are temporarily disabled to resolve dependency issues
        // Since we are using public read access for profile pictures, this is not
        // strictly necessary for now
        throw new UnsupportedOperationException("Presigned URL generation is currently disabled");
    }

    @Override
    public String extractFileKey(String fileUrl) {
        // Extract key from URL format: https://bucket.s3.region.amazonaws.com/key
        try {
            String[] parts = fileUrl.split(".amazonaws.com/");
            if (parts.length > 1) {
                return parts[1];
            }
            throw new FileStorageException("Invalid S3 URL format: " + fileUrl);
        } catch (Exception e) {
            throw new FileStorageException("Failed to extract file key from URL: " + fileUrl);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new FileStorageException("File is empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new FileStorageException("File size exceeds maximum limit of 5MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase())) {
            throw new FileStorageException("Invalid file type. Only JPEG, PNG, and WebP images are allowed");
        }
    }

    private String generateFileName(String originalFilename) {
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        return UUID.randomUUID().toString() + "_" + System.currentTimeMillis() + extension;
    }
}
