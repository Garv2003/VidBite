FROM python:alpine
EXPOSE 8907
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
CMD ["gunicorn","--bind","0.0.0.0:80","app:create_app()"]
