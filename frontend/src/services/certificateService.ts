import API from './api';

export interface Certificate {
    id: string;
    name: string;
    description: string;
    issuedDate: string;
    expiryDate?: string;
    status: 'ACTIVE' | 'REVOKED' | 'EXPIRED' | 'PENDING';
    blockchainHash?: string;
    qrCode?: string;
    views: number;
    holderName: string;
    holderUsername: string;
    issuerName: string;
    issuerOrganization?: string;
    skills: string[];
}

export interface IssueCertificateData {
    recipientName: string;
    recipientEmail: string;
    certificateName: string;
    skills: string[]; // Comma separated string in form, but array here? No, backend expects list.
    // Wait, let's check CertificateRequest.java to be sure about the request body.
}

// Placeholder for now, will update after checking CertificateRequest
export interface CertificateRequestData {
    name: string;
    description?: string;
    recipientEmail: string;
    issuedDate: string; // YYYY-MM-DD
    expiryDate?: string; // YYYY-MM-DD
    skills: string[];
}

class CertificateService {
    async issueCertificate(data: CertificateRequestData): Promise<Certificate> {
        const response = await API.post('/certificates/issue', data);
        return response.data.data;
    }

    async getIssuedCertificates(): Promise<Certificate[]> {
        const response = await API.get('/certificates/issued');
        return response.data.data;
    }

    async getMyCertificates(): Promise<Certificate[]> {
        const response = await API.get('/certificates/my-certificates');
        return response.data.data;
    }

    async getCertificateById(id: string): Promise<Certificate> {
        const response = await API.get(`/certificates/${id}`);
        return response.data.data;
    }

    async revokeCertificate(id: string): Promise<void> {
        await API.delete(`/certificates/${id}/revoke`);
    }
}

export const certificateService = new CertificateService();
