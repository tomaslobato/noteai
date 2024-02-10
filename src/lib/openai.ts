import { Configuration, OpenAIApi } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function generateImagePrompt(name: string) {
  try {
    const res = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content:
            "You are an creative and helpful AI assistance capable of generating interesting thumbnail descriptions for my notes. Your output will be fed into the DALL-E API to generate a thumbnail. The description should be minimalistic and flat styled",
        },
        {
          role: "user",
          content: `Please generate a thumbnail description for my note titled: ${name}`,
        },
      ],
    });
    const data = await res.json();
    const imageDescription = data.choices[0].message.content;
    return imageDescription as string;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function generateImage(imgPrompt: string) {
  try {
    const res = await openai.createImage({
      prompt: imgPrompt,
      n: 1,
      size: '256x256'
    })
    const data = await res.json()
    const imageUrl = data.data[0].url
    return imageUrl as string
  } catch (error) {
    console.error(error)
  }
}
