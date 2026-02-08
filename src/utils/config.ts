export const getApiBaseUrl = () => {
    if (typeof window !== "undefined") {
        const host = window.location.hostname;
        // If on localhost or 127.0.0.1, use local backend
        if (host === "localhost" || host === "127.0.0.1") {
            return "http://127.0.0.1:8000";
        }
    }
    // Otherwise (DevTunnels, production, etc.), use the environment variable
    return process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
};
