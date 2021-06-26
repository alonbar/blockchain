FROM python:3.8-slim-buster
RUN pip install flask flask-cors
ENV DANIEL 1
EXPOSE 5000
WORKDIR /app
COPY . .
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]



