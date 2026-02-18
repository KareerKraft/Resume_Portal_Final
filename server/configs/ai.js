import OpenAI from "openai";

let ai;

const initAI = () => {
    try {
        if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim()) {
            ai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY.trim(),
                baseURL: process.env.OPENAI_BASE_URL,
            });
            console.log("✓ OpenAI initialized successfully");
        } else {
            console.warn("⚠ OPENAI_API_KEY not configured - AI features will not be available");
            ai = null;
        }
    } catch (error) {
        console.warn("⚠ Failed to initialize OpenAI:", error.message);
        ai = null;
    }
};

initAI();

// Export a proxy that will warn if AI is used without configuration
export default ai || {
    chat: {
        completions: {
            create: async () => {
                throw new Error("OpenAI is not configured. Please set OPENAI_API_KEY environment variable.");
            }
        }
    }
}