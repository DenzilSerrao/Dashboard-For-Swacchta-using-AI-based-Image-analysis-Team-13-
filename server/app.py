from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['MONGO_URI'] = os.getenv('MONGO_URI', 'mongodb://localhost:27017/mydatabase')

# Initialize PyMongo
mongo = PyMongo(app)
users_collection = mongo.db.users

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

if __name__ == '__main__':
    app.run(debug=True)
