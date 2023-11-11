FROM python:3.9

WORKDIR /api

COPY ./ .

RUN apt update && apt install -y --no-install-recommends ca-certificates wget curl
RUN pip3 install -r requirements.txt

EXPOSE 80
ENTRYPOINT ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
