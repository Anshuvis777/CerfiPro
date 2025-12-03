package com.certifypro.util;

import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

@Component
public class BlockchainUtil {

    /**
     * Generate a mock blockchain hash for certificate verification
     * In production, this would interact with actual blockchain
     */
    public String generateBlockchainHash(UUID certificateId, String holderEmail, String issuerEmail,
            String certificateName) {
        try {
            String data = certificateId.toString() + holderEmail + issuerEmail + certificateName
                    + System.currentTimeMillis();
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data.getBytes(StandardCharsets.UTF_8));

            // Convert to hex string with 0x prefix (blockchain style)
            StringBuilder hexString = new StringBuilder("0x");
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1)
                    hexString.append('0');
                hexString.append(hex);
            }

            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error generating blockchain hash", e);
        }
    }

    /**
     * Verify blockchain hash (mock implementation)
     * In production, this would verify against actual blockchain
     */
    public boolean verifyBlockchainHash(String hash) {
        // Mock verification - check if hash has correct format
        return hash != null && hash.startsWith("0x") && hash.length() == 66;
    }
}
