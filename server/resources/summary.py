from flask.views import MethodView
from flask_smorest import Blueprint, abort
from schemas import SummarySchema, SaveSummarySchema,UpdateSummarySchema
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from models.summary import SummaryModel
from models import UserModel
from db import db

import os
import google.generativeai as genai
from youtube_transcript_api import YouTubeTranscriptApi
from pytube import YouTube
from dotenv import load_dotenv

blp = Blueprint("Summaries", __name__, description="Operations on summaries")

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

prompt = """You are a YouTube video summarizer. You will take the transcript text
and summarize the entire video, providing key points in under 500 words. 
Please provide the summary of the following text: """


def extract_transcript_details(youtube_video_url):
    try:
        video_id = youtube_video_url.split("=")[1]
        transcript_text = YouTubeTranscriptApi.get_transcript(video_id)
        transcript = " ".join([i["text"] for i in transcript_text])
        return transcript.strip(), video_id
    except Exception as e:
        print(f"Error extracting transcript: {e}")
        return "", None

def get_youtube_video_details(youtube_video_url):
    try:
        video = YouTube(youtube_video_url)
        print(video.rating)
        return {
            "thumbnail": video.thumbnail_url,
        }
    except Exception as e:
        print(f"Error getting video details: {e}")
        return None

def generate_summary(transcript_text):
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt + transcript_text)

    if hasattr(response, "parts") and response.parts:
        return response.parts[0].text
    else:
        print("No valid response part returned.")
        return "Unable to generate summary due to content restrictions."


def get_summary(youtube_video_url):
    transcript_text, video_id = extract_transcript_details(youtube_video_url)
    if transcript_text:
        summary = generate_summary(transcript_text)
        return summary, video_id
    else:
        return "No transcript available.", None


@blp.route("/summary/<int:summary_id>")
class Summary(MethodView):
    @jwt_required()
    @blp.response(200, SummarySchema)
    def get(self, summary_id):
        try:
            summary = SummaryModel.query.get_or_404(summary_id)
            return summary
        except KeyError:
            abort(404, message="Summary not found.")

    @jwt_required()
    def delete(self, summary_id):
        try:
            summary = SummaryModel.query.get_or_404(summary_id)
            user = UserModel.query.get_or_404(get_jwt_identity())
            if summary.user_id != user.id:
                abort(403, message="This summary does not belong to you.")
            user.saved_summaries -= 1
            db.session.delete(summary)
            db.session.commit()
            return {"message": "Summary deleted"}, 200
        except KeyError:
            abort(404, message="Summary not found.")

    @jwt_required()
    @blp.arguments(UpdateSummarySchema)
    @blp.response(200, SummarySchema)
    def put(self, data, summary_id):
        try:
            summary = SummaryModel.query.get_or_404(summary_id)
            user = UserModel.query.get_or_404(get_jwt_identity())
            if summary.user_id != user.id:
                abort(403, message="This summary does not belong to you.")
            summary.name = data["name"]
            summary.summary = data["summary"]
            db.session.commit()
            return summary
        except KeyError:
            abort(404, message="Summary not found.")


@blp.route("/summary")
class SummaryList(MethodView):
    @jwt_required()
    @blp.response(200, SummarySchema(many=True))
    def get(self):
        user_id = get_jwt_identity()
        return SummaryModel.query.filter_by(user_id=user_id).all()


@blp.route("/summarize")
class Summarize(MethodView):
    @jwt_required()
    @blp.arguments(SaveSummarySchema)
    @blp.response(201, SummarySchema)
    def post(self, data):
        try:
            youtube_video_url = data["video_url"]
            video_summary, video_id = get_summary(youtube_video_url)

            if not video_id:
                abort(400, message="Failed to extract video transcript.")

            video_details = get_youtube_video_details(youtube_video_url)
            if not video_details:
                abort(400, message="Failed to fetch video details.")

            summary = SummaryModel(
                name=data["name"],
                video_url=youtube_video_url,
                video_id=video_id,
                summary=video_summary,
                user_id=get_jwt_identity(),
                thumbnail=video_details["thumbnail"],
            )

            user = UserModel.query.get_or_404(get_jwt_identity())
            user.saved_summaries += 1
            user.total_videos_processed += 1

            db.session.add(summary)
            db.session.commit()
        except IntegrityError:
            abort(400, message="A summary for this video already exists.")
        except SQLAlchemyError:
            abort(500, message="An error occurred while saving the summary.")

        return summary
