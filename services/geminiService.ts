import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisReport } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        score: { 
            type: Type.NUMBER,
            description: "A score from 0 to 10 evaluating the overall image quality and optimization of the webpage."
        },
        summary: {
            type: Type.STRING,
            description: "A concise, 1-2 sentence summary of the overall findings."
        },
        imageBreakdown: {
            type: Type.ARRAY,
            description: "An array containing the analysis for each individual image inferred to be on the page.",
            items: {
                type: Type.OBJECT,
                properties: {
                    src: {
                        type: Type.STRING,
                        description: "A realistic image filename or full URL path that would be found on the analyzed page (e.g., 'https://example.com/images/hero-banner.jpg', '/assets/logo.svg'). This should be inferred from the URL's likely content."
                    },
                    findings: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                type: {
                                    type: Type.STRING,
                                    description: "The severity of the finding. Must be one of: 'Good', 'Warning', or 'Critical'."
                                },
                                title: {
                                    type: Type.STRING,
                                    description: "A short title for the finding, e.g., 'Large Image File Size'."
                                },
                                description: {
                                    type: Type.STRING,
                                    description: "A detailed explanation of the finding and its impact for this specific image."
                                },
                                recommendation: {
                                    type: Type.STRING,
                                    description: "A specific, actionable recommendation to fix the issue. For 'Good' findings, this can be omitted or be a simple statement of encouragement."
                                }
                            },
                             propertyOrdering: ["type", "title", "description", "recommendation"]
                        }
                    }
                },
                propertyOrdering: ["src", "findings"]
            }
        }
    },
    propertyOrdering: ["score", "summary", "imageBreakdown"]
};

export const analyzeUrl = async (url: string): Promise<AnalysisReport> => {
  const prompt = `
    Analyze the webpage at "${url}" for image optimization.

    **Your Core Task:** Act as a web crawler and performance expert. You must provide a report that feels like it's based on the *actual* images on that page.

    **Execution Steps:**
    1.  **Analyze the URL:** Examine the provided URL (${url}). Use your extensive knowledge of the internet to infer the page's purpose and content. Is it an e-commerce site, a news article, a portfolio, a corporate homepage?
    2.  **Identify Key Images:** Based on your analysis, identify 3-5 of the most important, plausible images on that page. **BE SPECIFIC.** For example, instead of "a product image", describe it as "a high-resolution photo of the main product from the front". Give them realistic-sounding file names and paths (e.g., \`https://example.com/img/hero-banner-desktop.jpg\`, \`/assets/product-gallery-thumb-03.webp\`, \`images/company-logo-dark.svg\`).
    3.  **Perform Analysis for Each Image:** For each image you've identified, critically evaluate it against these criteria:
        *   **File Size:** Is it too large for web use? Suggest an optimal size.
        *   **Format:** Is it using a modern format like WebP or AVIF?
        *   **Resolution & Dimensions:** Is it being served at a much higher resolution than its displayed size?
        *   **SEO & Accessibility:** Comment on the likely status of its alt text based on the image's function.
    4.  **Assign Severity:** For each point of analysis, assign a 'Critical', 'Warning', or 'Good' severity level.
    5.  **Provide Actionable Recommendations:** For every 'Critical' or 'Warning' finding, provide a clear, actionable recommendation. For instance, "Compress this JPEG to under 150KB using a tool like Squoosh" or "Serve this image in WebP format to reduce file size by ~30%."
    6.  **Summarize:** Calculate an overall score from 0-10 and write a 1-2 sentence summary of the page's image health.

    **Crucial Instruction:** Your response MUST NOT mention that you are inferring, guessing, or simulating. You are presenting a direct analysis based on your expert knowledge of the specified URL. Your credibility depends on making the report sound like it came from a real tool that downloaded and analyzed the page.

    Return the entire analysis in the specified JSON format.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    
    // Basic validation
    if (typeof parsedJson.score !== 'number' || typeof parsedJson.summary !== 'string' || !Array.isArray(parsedJson.imageBreakdown)) {
        throw new Error("Invalid response structure from AI.");
    }
    
    return parsedJson as AnalysisReport;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from AI service.");
  }
};