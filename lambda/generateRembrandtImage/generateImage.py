import json
from openai import OpenAI
import os

def describe_image(urls):
    client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])

    content = []
    content.append({
        "type": "text",
        "text": "Describe the style of this image as a comma-separated list of descriptors, which can include photographic techniques, composition styles, moods, genres, or type of scenes. Include the color scheme. Do not describe the content of the image."
    })
    for url in urls:
        content.append(
            {
                "type": "image_url",
                "image_url": {
                    "url": url,
                },
            }
        )

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": content
            }
        ],
        max_tokens=300,
    )

    return response.choices[0].message.content

def generate_image(prompt, qualities):
    client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])

    prompt_context= " with the following image style qualities: " + qualities + ". Do not include text unless specified."

    response = client.images.generate(
        model="dall-e-3",
        prompt= prompt + prompt_context,
        size="1024x1024",
        quality="standard",
        n=1,
    )

    return response.data[0].url

def handler(event, context):
    body = json.loads(event['body'])
    print('Grabbing image qualities...')
    try:

        qualities = describe_image(body['urls'])
        print('Generating image...')
        photo_url = generate_image(body['prompt'], qualities)
        return {"success": True, "url": photo_url}
    except Exception as e:
        print(e)
        return {"success": False}