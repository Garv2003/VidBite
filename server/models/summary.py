from db import db
from datetime import datetime

class SummaryModel(db.Model):
    __tablename__ = "summaries"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    video_url = db.Column(db.String(80), nullable=False)
    video_id = db.Column(db.String(80), nullable=False)
    summary = db.Column(db.String(255), nullable=False) 
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    thumbnail = db.Column(db.String(80), nullable=False)
