import os
from flask import Flask, request
from dotenv import load_dotenv
from flask_cors import CORS
import google.generativeai as genai
from youtube_transcript_api import YouTubeTranscriptApi

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

prompt="""You are Yotube video summarizer. You will be taking the transcript text
and summarizing the entire video and providing the important summary in points
within 500 words. Please provide the summary of the text given here: """


def extract_transcript_details(youtube_video_url):
    try:
        video_id = youtube_video_url.split("=")[1]
        transcript_text = YouTubeTranscriptApi.get_transcript(video_id)
        transcript = ""
        for i in transcript_text:
            transcript += " " + i["text"]

        return transcript.strip()  
    except Exception as e:
        print(f"Error extracting transcript: {e}")
        return "" 

def generate_summary(transcript_text, prompt):
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt + transcript_text)
    
    if hasattr(response, 'parts') and response.parts:
        return response.parts[0].text 
    else:
        print("No valid response part returned.")
        return "Unable to generate summary due to content restrictions."

def get_summary(youtube_video_url):
    transcript_text = extract_transcript_details(youtube_video_url)
    if transcript_text:  
        summary = generate_summary(transcript_text, prompt)
        return summary
    else:
        return "No transcript available."

app = Flask(__name__)

CORS(app)

@app.route("/health")
def check_health():
    return "OK", 200

@app.route("/summarize", methods=["POST"])
def summarize():
    try:
        youtube_video_url = request.json.get("url")
        summary = get_summary(youtube_video_url)
        print(summary)
        return {"summary": summary}, 200
    except Exception as e:
        print(f"Error generating summary: {e}")
        return {"error": str(e)}, 500

if __name__=="__main__":
    app.run(host="0.0.0.0", port=5013,debug=True)