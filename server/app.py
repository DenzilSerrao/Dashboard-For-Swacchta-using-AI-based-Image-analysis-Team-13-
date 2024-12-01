from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
import os
from ultralytics import YOLO
from dotenv import load_dotenv
from PIL import Image
import numpy as np
import pandas as pd
from werkzeug.utils import secure_filename


# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['MONGO_URI'] = os.getenv('MONGO_URI', 'mongodb://localhost:27017/mydatabase')
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = './upload/input'
app.config['OUTPUT_FOLDER'] = './upload/output'


# model_path = r'/content/runs/train/weights/best.pt'
# if not os.path.exists(model_path):
#     raise FileNotFoundError(f"Model file not found at {model_path}")

# Load the YOLO model with your trained weights
model = YOLO('best.pt')

# Initialize PyMongo
mongo = PyMongo(app)
users_collection = mongo.db.users

# Ensure upload folder exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

@app.route('/api/ping', methods=['POST'])
def ping_check():
    return jsonify({'status': 'ok', 'message': 'Server is ready'}), 200

def generate_token(user_id):
    """Generate JWT token for authentication"""
    token = jwt.encode({
        'user_id': str(user_id),
        'exp': datetime.utcnow() + timedelta(days=1)
    }, app.config['SECRET_KEY'], algorithm='HS256')
    return token

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()

    # Validate required fields
    required_fields = ['email', 'password', 'name']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    # Check if user already exists
    if users_collection.find_one({'email': data['email']}):
        return jsonify({'error': 'Email already registered'}), 409

    # Create new user
    try:
        hashed_password = generate_password_hash(data['password'], method='sha256')
        new_user = {
            'email': data['email'],
            'password': hashed_password,
            'name': data['name'],
            'role': 'user',
            'created_at': datetime.utcnow()
        }
        result = users_collection.insert_one(new_user)
        print(result.inserted_id)
        # Generate token
        token = generate_token(result.inserted_id)
        print(result.inserted_id)

        return jsonify({
            'message': 'Registration successful',
            'token': token,
            'user': {
                'id': str(result.inserted_id),
                'email': new_user['email'],
                'name': new_user['name'],
                'role': new_user['role']
            }
        }), 201

    except Exception as e:
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()

    # Validate required fields
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing email or password'}), 400

    # Find user
    user = users_collection.find_one({'email': data['email']})

    if not user or not check_password_hash(user['password'], data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401

    # Generate token
    token = generate_token(user['_id'])
    print(token)

    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': {
            'id': str(user['_id']),
            'email': user['email'],
            'name': user['name'],
            'role': user['role']
        }
    }), 200

# @app.route('/api/verify-token', methods=['GET'])
# def verify_token():
#     auth_header = request.headers.get('Authorization')
    
#     if not auth_header or not auth_header.startswith('Bearer '):
#         return jsonify({'error': 'No token provided'}), 401

#     token = auth_header.split(' ')[1]

#     try:
#         # Decode and verify token
#         payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
#         print("verify_token: ",payload['user_id'])
#         user = users_collection.find_one({'_id': payload['user_id']})
        
#         if not user:
#             raise Exception('User not found')

#         return jsonify({
#             'valid': True,
#             'user': {
#                 'id': str(user['_id']),
#                 'email': user['email'],
#                 'name': user['name'],
#                 'role': user['role']
#             }
#         }), 200

#     except jwt.ExpiredSignatureError:
#         return jsonify({'error': 'Token has expired'}), 401
#     except jwt.InvalidTokenError:
#         return jsonify({'error': 'Invalid token'}), 401
#     except Exception as e:
#         return jsonify({'error': str(e)}), 401

@app.route('/api/verify-token', methods=['GET'])
def verify_token():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'No token provided'}), 401

    token = auth_header.split(' ')[1]  # Extract the token part
    try:
        decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = decoded_token.get('user_id')  # Extract the user ID from the token payload
        if not user_id:
            return jsonify({'error': 'Invalid token payload'}), 401
        return jsonify({'message': 'Token is valid', 'user_id': user_id}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    
def allowed_file(filename):
    """Check if the uploaded file is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Preprocess the image if necessary (e.g., resizing, normalization)
def preprocess_image(image):
    image = image.resize((640, 640))  # Resize to match the input size expected by the model
    image_array = np.array(image) / 255.0  # Normalize pixel values (optional)
    return image_array

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    print(filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    print({"message": f"File {filename} uploaded successfully"}), 200

    if file and allowed_file(file.filename):
        try:
            # Open the uploaded image
            image = Image.open(file)
            
            # Preprocess the image
            preprocessed_image = preprocess_image(image)
            
            # Run the YOLO model
            results = model.predict(preprocessed_image)
            
            # Process the results (extract bounding boxes, classes, etc.)
            detections = results[0].boxes.data.tolist()  # Example: bounding boxes and confidence scores
            return jsonify({'detections': detections}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Invalid file type'}), 400


if __name__ == '__main__':
    app.run(debug=True)
