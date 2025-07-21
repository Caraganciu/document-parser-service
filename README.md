# 📄 Document Parser Service
A Node.js microservice for uploading, processing (OCR), and validating PDF/image documents using a queue-based background worker system. The OCR results and processing status are stored in Redis.


## 🧩 Features
Upload files (PDFs/images)

Queue file for background OCR processing using bull and Redis

Convert PDF pages to images via pdf2pic

Simulate OCR processing

Validate required invoice fields (e.g. "issued to", "pay to", etc.)

Store OCR results and processing status in Redis

API to check file processing status



## 🚀 Getting Started
#### 1. Clone the Repository

git clone https://github.com/Caraganciu/document-parser-service

cd document-parser-service

#### 2. Install Dependencies

npm install

#### 3. Setup Environment

Create a .env file in the root:


PORT=3000

REDIS_URL=redis://127.0.0.1:6379

UPLOAD_DIR=uploads

Make sure Redis is running locally or update the REDIS_URL accordingly.


