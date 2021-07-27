FROM python:3.8.5-alpine
COPY . /esishare
WORKDIR /esishare
RUN pip install -r requirements.txt
ENTRYPOINT ["python"]
CMD ["app.py"]