

import { getApiBaseUrl } from "@/utils/config";

const API_URL = `${getApiBaseUrl()}/api/v1`;

export const authService = {
    async login(data: any) {
        const response = await fetch(`${API_URL}/auth/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return response;
    },

    async signup(data: any) {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return response;
    },
};
