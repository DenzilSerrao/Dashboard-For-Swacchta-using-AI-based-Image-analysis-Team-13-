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


# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['MONGO_URI'] = os.getenv('MONGO_URI', 'mongodb://localhost:27017/mydatabase')
app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', './uploads')
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg'}

# Load the YOLO model with your trained weights
model = YOLO('/content/runs/detect/train/weights/best.pt')

# Initialize PyMongo
mongo = PyMongo(app)
users_collection = mongo.db.users

# Ensure upload folder exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

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

        # Generate token
        token = generate_token(result.inserted_id)

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

@app.route('/api/verify-token', methods=['GET'])
def verify_token():
    auth_header = request.headers.get('Authorization')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'No token provided'}), 401

    token = auth_header.split(' ')[1]

    try:
        # Decode and verify token
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user = users_collection.find_one({'_id': payload['user_id']})
        
        if not user:
            raise Exception('User not found')

        return jsonify({
            'valid': True,
            'user': {
                'id': str(user['_id']),
                'email': user['email'],
                'name': user['name'],
                'role': user['role']
            }
        }), 200

    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 401
    
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
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        # Save the uploaded file
        filename = secure_filename(file.filename)
        file_path = os.path.join('./uploads', filename)
        file.save(file_path)

        try:
            # Open the image with PIL
            image = Image.open(file_path).convert('RGB')

            # Run inference with the YOLO model
            results = model.predict(source=file_path, conf=0.25)  # Set confidence threshold as needed
            detections = results.pandas().xyxy[0].to_dict(orient='records')

            # Prepare response data
            response = {
                'message': 'File uploaded and analyzed successfully',
                'detections': detections
            }

            return jsonify(response), 201

        except Exception as e:
            return jsonify({'error': 'Failed to process the file', 'details': str(e)}), 500
    else:
        return jsonify({'error': 'Invalid file format'}), 400

if __name__ == '__main__':
    app.run(debug=True)
