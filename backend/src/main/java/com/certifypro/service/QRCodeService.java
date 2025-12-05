package com.certifypro.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class QRCodeService {

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    /**
     * Generate QR code as Base64 string for a certificate verification URL
     *
     * @param verificationId The unique verification ID of the certificate
     * @return Base64 encoded QR code image
     */
    public String generateQRCodeBase64(String verificationId) {
        try {
            String verificationUrl = frontendUrl + "/verify/" + verificationId;

            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
            hints.put(EncodeHintType.MARGIN, 1);

            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(verificationUrl, BarcodeFormat.QR_CODE, 300, 300, hints);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);

            byte[] qrCodeBytes = outputStream.toByteArray();
            return "data:image/png;base64," + Base64.getEncoder().encodeToString(qrCodeBytes);

        } catch (WriterException | IOException e) {
            log.error("Failed to generate QR code for verification ID: {}", verificationId, e);
            return null;
        }
    }

    /**
     * Generate a unique verification ID
     *
     * @return Random verification ID (8 characters)
     */
    public String generateVerificationId() {
        // Generate a short, readable verification ID
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder verificationId = new StringBuilder();
        for (int i = 0; i < 8; i++) {
            int index = (int) (Math.random() * chars.length());
            verificationId.append(chars.charAt(index));
        }
        return verificationId.toString();
    }
}
