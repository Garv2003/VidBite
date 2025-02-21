from flask.views import MethodView
from flask_smorest import Blueprint, abort
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import (
    create_access_token,
    get_jwt,
    jwt_required,
    get_jwt_identity
)
from flask import jsonify
from db import db
from models import UserModel
from schemas import UserSchema,LoginUserSchema
from blocklist import BLOCKLIST


blp = Blueprint("Users", "users", description="Operations on users")

@blp.route("/register")
class UserRegister(MethodView):
    @blp.arguments(UserSchema)
    def post(self, user_data):
        print(user_data)
        if UserModel.query.filter(UserModel.email == user_data["email"]).first():
            abort(409, message="A user with that email already exists.")

        user = UserModel(
            name=user_data["name"],
            email=user_data["email"],
            password=pbkdf2_sha256.hash(user_data["password"]),
        )
        db.session.add(user)
        db.session.commit()

        return {"message": "Registration successful."}, 201

@blp.route("/user")
class User(MethodView):
    @jwt_required()
    @blp.response(200, UserSchema(exclude=("password",)))
    def get(self):
        user_id = get_jwt_identity() 
        user = UserModel.query.get_or_404(user_id)
        if not user:
            abort(404, message="User not found.")
        return jsonify({
            "data":{
                "id": user.id,  
                "name": user.name,
                "email": user.email,
                "stats": {
                    "savedSummaries": user.saved_summaries,
                    "totalVideosProcessed": user.total_videos_processed,
                }
            },
            "message":"User retrieved."
        }) 

    @jwt_required()
    def delete(self, user_id):
        user = UserModel.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return {"message": "User deleted."}, 200

@blp.route("/login")
class UserLogin(MethodView):
    @blp.arguments(LoginUserSchema)
    def post(self, user_data):
        user = UserModel.query.filter(
            UserModel.email == user_data["email"]
        ).first()

        if user and pbkdf2_sha256.verify(user_data["password"], user.password):
            access_token = create_access_token(identity=str(user.id))
            return {"access_token": access_token}, 200

        abort(401, message="Invalid credentials.")

@blp.route("/logout")
class UserLogout(MethodView):
    @jwt_required()
    def post(self):
        jti = get_jwt()["jti"]
        BLOCKLIST.add(jti)
        return {"message": "Successfully logged out"}, 200