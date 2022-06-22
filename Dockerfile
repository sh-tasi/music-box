FROM python:3.11.0a7-slim-bullseye
WORKDIR /app
ADD . /app
RUN pip install -r tempfile/requirements.txt 
EXPOSE 300
CMD ["python","app.py"] 