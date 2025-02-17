import uuid
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from schemas import SummarySchema
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import SQLAlchemyError
from models.summary import SummaryModel

import google.generativeai as genai
from youtube_transcript_api import YouTubeTranscriptApi
from dotenv import load_dotenv

blp = Blueprint("Summaries", __name__, description="Operations on summaries")

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

@blp.route("/summary/<string:summary_id>")
class Summary(MethodView):
    @jwt_required()
    @blp.response(200, SummarySchema)
    def get(cls, summary_id):
        try:
            summary = SummaryModel.query.get_or_404(summary_id)
            return summary
        except KeyError:
            abort(404, message="Summary not found.")

    @jwt_required()
    def delete(cls, store_id):
        try:
            summary = SummaryModel.query.get_or_404(store_id)
            db.session.delete(summary)
            db.session.commit()
            return {"message": "Summary deleted"}, 200
        except KeyError:
            abort(404, message="Summary not found.")

@blp.route("/summary")
class SummaryList(MethodView):
    @jwt_required()
    @blp.response(200, SummarySchema(many=True))
    def get(cls):
        return SummaryModel.query.filter_by(user_id=cls.user_id).all()

@blp.route("/summarize")
class Summarize(MethodView):
    @jwt_required()
    @blp.arguments(SummarySchema)
    @blp.response(201, SummarySchema)
    def post(self, summary_data):
        summary = SummaryModel(**summary_data)
        try:
            youtube_video_url = request.json.get("url")
            summary = get_summary(youtube_video_url)
            print(summary)
            db.session.add(summary)
            db.session.commit()
        except IntegrityError:
            abort(
                400,
                message="A store with that name already exists.",
            )
        except SQLAlchemyError:
            abort(500, message="An error occurred creating the store.")

        return summary