// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Configuration, OpenAIApi } from 'openai';

export default async function handler(req, res) {
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  });
  const openai = new OpenAIApi(config);

  const { topic, keywords } = req.body;

  // const response = await openai.createCompletion({
  //   model: 'text-davinci-003',
  //   temperature: 0,
  //   max_tokens: 3600,
  //   prompt: `
  //     Write a long and detailed SEO-friendly blog post about ${topic} that targets the following comma-separated keywords: ${keywords}.
  //     The content should be formatted in SEO friendly HTML.
  //     The response must also include appropriate title and meta description content.
  //     The return format must be stringified JSON in the following format:
  //     {
  //       "postContent": post content here,
  //       "title": title goes here,
  //       "metaDescription": meta description goes here
  //     }
  //   `
  // });

  const postContentResponse = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    messages: [
      {
        role: 'system', // Give gpt-3.5 instruction of what it is.
        content: 'You are a blog post generator.'
      },
      {
        role: 'user',
        content: `
          Write a long and detailed SEO-friendly blog post about ${topic} that targets the following comma-separated keywords: ${keywords}.
          The content should be formatted in SEO friendly HTML, limited to the following HTML tags: p, h1, h2,h 3, h4, h5, h6, strong, li, ol, ul, i
        `
      }
    ]
  });

  const postContent =
    postContentResponse.data.choices[0]?.message?.content || '';

  const titleResponse = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    messages: [
      {
        role: 'system', // Give gpt-3.5 instruction of what it is.
        content: 'You are a blog post generator.'
      },
      {
        role: 'user',
        content: `
          Write a long and detailed SEO-friendly blog post about ${topic} that targets the following comma-separated keywords: ${keywords}.
          The content should be formatted in SEO friendly HTML, limited to the following HTML tags: p, h1, h2,h 3, h4, h5, h6, strong, li, ol, ul, i
        `
      },
      {
        role: 'assistant',
        content: postContent
      },
      {
        role: 'user',
        content: `
        Generate appropriate title tag text from the above blog post
        `
      }
    ]
  });

  const metaDescriptionResponse = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    messages: [
      {
        role: 'system', // Give gpt-3.5 instruction of what it is.
        content: 'You are a blog post generator.'
      },
      {
        role: 'user',
        content: `
          Write a long and detailed SEO-friendly blog post about ${topic} that targets the following comma-separated keywords: ${keywords}.
          The content should be formatted in SEO friendly HTML, limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, li, ol, ul, i
        `
      },
      {
        role: 'assistant',
        content: postContent
      },
      {
        role: 'user',
        content: `
        Generate SEO-friendly meta description content for the above blog post.
        `
      }
    ]
  });

  const title = titleResponse.data.choices[0]?.message?.content || '';

  const metaDescription =
    metaDescriptionResponse.data.choices[0]?.message?.content || '';

  console.log(postContent, 'PC');
  console.log(title, 'TC');
  console.log(metaDescription, 'MDC');

  res.status(200).json({
    data: {
      title,
      postContent,
      metaDescription
    }
  });
}
