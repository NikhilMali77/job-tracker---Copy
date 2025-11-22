// server/controllers/scrapeController.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI("AIzaSyATbzGjGXI2JxpfsDJG9-4UeQxCfnbtuwM");

// @desc    Extract job details from text using AI
// @route   POST /api/scrape/extract-details
exports.extractJobDetails = async (req, res) => {
  // 1. Log when the endpoint is hit
  console.log('\n--- [scrapeController] /api/scrape/extract-details HIT ---');
  
  const { text } = req.body;

  if (!text) {
    // 2. Log if no text was received
    console.error('[scrapeController] ERROR: No text found in request body.');
    return res.status(400).json({ message: 'Text is required' });
  }

  // 3. Log the received text (first 500 chars)
  console.log(`[scrapeController] Received text (first 500 chars): ${text.substring(0, 500)}...`);
  console.log(text, 'textt')
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
      You are an expert job data extractor. 
      Analyze the following text from a job posting.
      Extract ONLY the "Job Title" and "Company Name".
      
      Respond ONLY with a valid JSON object in the format:
      {
        "title": "The Job Title",
        "company": "The Company Name"
      }

      Do not include any other text, greetings, or explanations.
      
      Here is the text:
      ---
      ${text}
      ---
    `;

    console.log('[scrapeController] Sending prompt to Gemini API...');
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let jsonText = response.text();

    // 4. Log the raw response from Gemini
    console.log('[scrapeController] Raw response from Gemini:', jsonText);
    
    // Clean the response
    jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();

    // Parse the JSON string
    const data = JSON.parse(jsonText);

    // 5. Log the final JSON data
    console.log('[scrapeController] Successfully parsed JSON:', data);
    
    res.status(200).json(data);

  } catch (error) {
    // 6. Log any errors
    console.error('[scrapeController] ERROR calling Gemini API or parsing JSON:');
    console.error(error);
    res.status(500).json({ message: 'Failed to extract details from text.' });
  }
};