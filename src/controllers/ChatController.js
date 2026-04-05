import axios from 'axios';

class ChatController {
  static async sendMessage(req, res) {
    try {
      const { message } = req.body;

      // Validate input
      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Message is required and must be a non-empty string'
        });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';

      if (!apiKey) {
        return res.status(500).json({
          success: false,
          message: 'Gemini API key is not configured'
        });
      }

      // CHATBOT SYSTEM PROMPT - Customize Here
      const systemPrompt = process.env.CHATBOT_PROMPT || 
        `You are a helpful AI assistant for EverZone, a professional web and mobile development company. 
        You help users with questions about our services, projects, team, and general web development topics.
        Be professional, friendly, and informative. Keep responses concise.`;

      // Call Gemini API
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: systemPrompt + '\n\nUser: ' + message
                }
              ]
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Extract the response text
      const botMessage = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!botMessage) {
        return res.status(500).json({
          success: false,
          message: 'Failed to generate response from Gemini'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Message processed successfully',
        data: {
          message: botMessage
        }
      });
    } catch (error) {
      console.error('Chat API error:', error);
      
      // Handle specific Gemini API errors
      if (error.response?.data?.error) {
        return res.status(error.response.status || 500).json({
          success: false,
          message: error.response.data.error.message || 'Failed to process message'
        });
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Failed to process chat message'
      });
    }
  }
}

export default ChatController;
