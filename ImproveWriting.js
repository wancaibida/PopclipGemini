// #popclip extension for Google Gemini
// name: Gemini Improve Writing
// icon: "iconify:tabler:file-text-ai"
// language: javascript
// module: true
// entitlements: [network]
// options: [{
//   identifier: apikey, label: API Key, type: string,
//   description: 'Obtain API key from Google Cloud Console'
// },
// {
//    identifier: model, label: 'model', type: multiple,
//    values:['gemini-1.5-pro','gemini-1.5-flash']
//  }, 
// {
//   identifier: prompt, label: 'Improve Writing Prompt', type: string,
//   defaultValue: "",
//   description: 'Enter the prompt template using {input} as a placeholder for the text'
// }
// ]

const axios = require("axios");

async function generateContent(input, options) {
  let prompt;
  if(options.prompt.length === 0){
     prompt="I will give you text content, you will rewrite it and output a better version of my text. Correct spelling, grammar, and punctuation errors in the given text. Keep the meaning the same. Only give me the output and nothing else. Now, using the concepts above, re-write the following text. Respond in the same language variety or dialect of the following text: {input}";
  } 
  else{
     prompt=options.prompt;
  }

  prompt=prompt.replace('{input}', input.text);
  const requestBody = {
    "contents": [{
      "parts": [
        {"text": prompt}
      ]
    }],
    "safetySettings": [
      {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_NONE"
      },
      {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_NONE"
      },
      {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_NONE"
      },
      {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_NONE"
      }
    ],
    "generationConfig": {
      "stopSequences": [
        "Title"
      ],
      "temperature": 1.0,
      "maxOutputTokens": 8192,
      "topP": 0.95,
      "topK": 64
    }
  };

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${options.model}:generateContent?key=${options.apikey}`,
      requestBody,
      { headers: { 'Content-Type': 'application/json' } }
    );

    const generatedText = response.data.candidates[0].content.parts.map(part => part.text).join('\n');
    return generatedText;
  } catch (error) {
    console.error("Error generating content:", error);
    return "Error generating content: " + error.message;
  }
}

exports.actions = [{
  title: "Gemini Improve Writing",
  after: "paste-result",
  code: async (input, options) => generateContent(input, options),
}];