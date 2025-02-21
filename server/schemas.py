from marshmallow import Schema, fields

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    email = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)

class LoginUserSchema(Schema):
    email = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)

class SummarySchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    video_url = fields.Str(required=True)
    video_id = fields.Str(required=True)
    summary = fields.Str(required=True)
    created_at = fields.DateTime(dump_only=True)
    user_id = fields.Int(required=True)
    thumbnail = fields.Str(required=True)

class SaveSummarySchema(Schema):
    video_url = fields.Str(required=True)
    name = fields.Str(required=True)

class UpdateSummarySchema(Schema):
    name = fields.Str(required=True)
    summary = fields.Str(required=True)