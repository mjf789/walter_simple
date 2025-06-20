import OpenAI from 'openai';

interface ScaleExtractionResponse {
  scaleName: string;
  items: Array<{
    question: string;
    responseOptions?: string[];
    responseType: 'likert' | 'multiple_choice' | 'text' | 'numeric';
    scaleRange?: { min: number; max: number; labels?: string[] };
  }>;
  instructions?: string;
  reverseScored?: number[];
}

class OpenAIService {
  private client: OpenAI | null = null;
  
  private getClient(): OpenAI {
    if (!this.client) {
      this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
    return this.client;
  }

  async extractScalesFromText(
    pdfText: string, 
    scaleDescription: string
  ): Promise<ScaleExtractionResponse> {
    const prompt = this.buildExtractionPrompt(pdfText, scaleDescription);
    
    try {
      const completion = await this.getClient().chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are an expert in psychological measurement and survey design. 
            Extract survey scales and questionnaire items from academic PDFs. 
            Output must be valid JSON matching the specified schema.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      });

      const response = completion.choices[0].message.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      return JSON.parse(response) as ScaleExtractionResponse;
    } catch (error) {
      console.error('OpenAI extraction error:', error);
      throw error;
    }
  }

  private buildExtractionPrompt(pdfText: string, scaleDescription: string): string {
    return `Extract the survey scale matching this description: "${scaleDescription}"

From this PDF text:
"""
${this.truncateText(pdfText, 8000)}
"""

Return a JSON object with this structure:
{
  "scaleName": "Name of the scale",
  "items": [
    {
      "question": "The item text",
      "responseOptions": ["option1", "option2"] or null for likert scales,
      "responseType": "likert" | "multiple_choice" | "text" | "numeric",
      "scaleRange": {
        "min": 1,
        "max": 7,
        "labels": ["label1", "label2", ...] // ONLY if explicitly shown in PDF
      }
    }
  ],
  "instructions": "Any instructions for the scale",
  "reverseScored": [3, 5, 8] // item numbers that are reverse scored
}

IMPORTANT RULES:
1. For scaleRange.labels, ONLY include labels that are EXPLICITLY written in the PDF
2. If the PDF shows numbers (1-5 or 1-7), preserve that exact range
3. If only endpoint labels are shown (e.g., "Strongly Disagree" and "Strongly Agree"), 
   only include those in the labels array at the correct positions, use null for missing middle labels
4. Labels must match the question content (e.g., fairness questions should have fairness-related labels)
5. Preserve the exact scale format from the PDF - don't invent or infer labels

Focus on extracting EXACTLY what is shown in the PDF, not what might be typical.`;
  }

  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    
    // Try to find the scale section first
    const keywords = ['scale', 'questionnaire', 'items', 'measure', 'inventory'];
    let bestStart = 0;
    let bestScore = 0;
    
    for (let i = 0; i < text.length - maxLength; i += 100) {
      const chunk = text.slice(i, i + 500).toLowerCase();
      const score = keywords.filter(k => chunk.includes(k)).length;
      if (score > bestScore) {
        bestScore = score;
        bestStart = i;
      }
    }
    
    return text.slice(bestStart, bestStart + maxLength);
  }

  async retryWithExponentialBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error: any) {
        if (i === maxRetries - 1) throw error;
        
        const delay = baseDelay * Math.pow(2, i);
        console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Max retries exceeded');
  }
}

export default new OpenAIService();