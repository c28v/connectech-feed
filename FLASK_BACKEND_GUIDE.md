# Flask Backend Integration Guide

This guide explains how to integrate your Flask backend with the React frontend.

## Backend Setup

### 1. Project Structure

```
backend/
├── app.py                 # Main Flask application
├── config.py              # Configuration settings
├── requirements.txt       # Python dependencies
├── models/
│   ├── __init__.py
│   ├── user.py           # User model
│   ├── tweet.py          # Tweet model
│   └── ...               # Other models
├── routes/
│   ├── __init__.py
│   ├── auth.py           # Authentication routes
│   ├── tweets.py         # Tweet routes
│   ├── users.py          # User routes
│   └── ...               # Other routes
└── utils/
    ├── __init__.py
    ├── database.py       # Database connection
    └── auth.py           # JWT utilities
```

### 2. Install Dependencies

```bash
cd backend
pip install flask flask-cors flask-jwt-extended mysql-connector-python sqlalchemy python-dotenv
```

### 3. Create `requirements.txt`

```txt
Flask==3.0.0
Flask-CORS==4.0.0
Flask-JWT-Extended==4.5.3
mysql-connector-python==8.2.0
SQLAlchemy==2.0.23
python-dotenv==1.0.0
```

### 4. Database Configuration (`config.py`)

```python
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')
    
    # MySQL Configuration
    MYSQL_HOST = os.getenv('MYSQL_HOST', 'localhost')
    MYSQL_USER = os.getenv('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', '')
    MYSQL_DB = os.getenv('MYSQL_DB', 'Linkup')
    
    SQLALCHEMY_DATABASE_URI = f'mysql+mysqlconnector://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/{MYSQL_DB}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
```

### 5. Database Connection (`utils/database.py`)

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from config import Config

engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### 6. User Model (`models/user.py`)

```python
from sqlalchemy import Column, BigInteger, String, Boolean, TIMESTAMP
from sqlalchemy.sql import func
from utils.database import Base

class User(Base):
    __tablename__ = 'User'
    
    user_id = Column(BigInteger, primary_key=True, autoincrement=True)
    username = Column(String(15), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    display_name = Column(String(50), nullable=False)
    bio = Column(String(160), nullable=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    
    def to_dict(self):
        return {
            'user_id': self.user_id,
            'username': self.username,
            'email': self.email,
            'display_name': self.display_name,
            'bio': self.bio,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'avatar_url': f'https://api.dicebear.com/7.x/avataaars/svg?seed={self.username}'
        }
```

### 7. Tweet Model (`models/tweet.py`)

```python
from sqlalchemy import Column, BigInteger, String, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from utils.database import Base

class Tweet(Base):
    __tablename__ = 'Tweet'
    
    tweet_id = Column(BigInteger, primary_key=True, autoincrement=True)
    author_user_id = Column(BigInteger, ForeignKey('User.user_id', ondelete='CASCADE'), nullable=False)
    content = Column(String(280), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    parent_tweet_id = Column(BigInteger, ForeignKey('Tweet.tweet_id', ondelete='SET NULL'), nullable=True)
    
    author = relationship('User', foreign_keys=[author_user_id])
    
    def to_dict(self, include_author=True):
        data = {
            'tweet_id': self.tweet_id,
            'author_user_id': self.author_user_id,
            'content': self.content,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'parent_tweet_id': self.parent_tweet_id,
        }
        if include_author and self.author:
            data['author'] = self.author.to_dict()
        return data
```

### 8. Authentication Routes (`routes/auth.py`)

```python
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models.user import User
from utils.database import SessionLocal

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/signup', methods=['POST'])
def signup():
    db = SessionLocal()
    try:
        data = request.json
        
        # Check if user exists
        existing_user = db.query(User).filter(
            (User.email == data['email']) | (User.username == data['username'])
        ).first()
        
        if existing_user:
            return jsonify({'error': 'User already exists'}), 400
        
        # Create new user
        new_user = User(
            username=data['username'],
            email=data['email'],
            password_hash=generate_password_hash(data['password']),
            display_name=data['display_name']
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Create access token
        access_token = create_access_token(identity=new_user.user_id)
        
        return jsonify({
            'user': new_user.to_dict(),
            'access_token': access_token
        }), 201
        
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

@auth_bp.route('/login', methods=['POST'])
def login():
    db = SessionLocal()
    try:
        data = request.json
        
        user = db.query(User).filter(User.email == data['email']).first()
        
        if not user or not check_password_hash(user.password_hash, data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        access_token = create_access_token(identity=user.user_id)
        
        return jsonify({
            'user': user.to_dict(),
            'access_token': access_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    db = SessionLocal()
    try:
        user_id = get_jwt_identity()
        user = db.query(User).filter(User.user_id == user_id).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify(user.to_dict()), 200
        
    finally:
        db.close()
```

### 9. Tweet Routes (`routes/tweets.py`)

```python
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.tweet import Tweet
from models.user import User
from utils.database import SessionLocal

tweets_bp = Blueprint('tweets', __name__, url_prefix='/api/tweets')

@tweets_bp.route('/', methods=['POST'])
@jwt_required()
def create_tweet():
    db = SessionLocal()
    try:
        user_id = get_jwt_identity()
        data = request.json
        
        new_tweet = Tweet(
            author_user_id=user_id,
            content=data['content'],
            parent_tweet_id=data.get('parent_tweet_id')
        )
        
        db.add(new_tweet)
        db.commit()
        db.refresh(new_tweet)
        
        return jsonify(new_tweet.to_dict()), 201
        
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

@tweets_bp.route('/feed', methods=['GET'])
@jwt_required()
def get_feed():
    db = SessionLocal()
    try:
        # Get tweets from users the current user follows
        # For now, just return all tweets
        tweets = db.query(Tweet).order_by(Tweet.created_at.desc()).limit(50).all()
        
        return jsonify([tweet.to_dict() for tweet in tweets]), 200
        
    finally:
        db.close()

@tweets_bp.route('/<int:tweet_id>', methods=['GET'])
def get_tweet(tweet_id):
    db = SessionLocal()
    try:
        tweet = db.query(Tweet).filter(Tweet.tweet_id == tweet_id).first()
        
        if not tweet:
            return jsonify({'error': 'Tweet not found'}), 404
        
        return jsonify(tweet.to_dict()), 200
        
    finally:
        db.close()

@tweets_bp.route('/<int:tweet_id>', methods=['DELETE'])
@jwt_required()
def delete_tweet(tweet_id):
    db = SessionLocal()
    try:
        user_id = get_jwt_identity()
        tweet = db.query(Tweet).filter(Tweet.tweet_id == tweet_id).first()
        
        if not tweet:
            return jsonify({'error': 'Tweet not found'}), 404
        
        if tweet.author_user_id != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        db.delete(tweet)
        db.commit()
        
        return jsonify({'message': 'Tweet deleted'}), 200
        
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()
```

### 10. Main Application (`app.py`)

```python
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from routes.auth import auth_bp
from routes.tweets import tweets_bp

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:8080"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Initialize JWT
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(tweets_bp)

@app.route('/api/health', methods=['GET'])
def health_check():
    return {'status': 'healthy'}, 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
```

### 11. Environment Variables (`.env`)

```env
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here

MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your-password
MYSQL_DB=Linkup
```

## Frontend Integration

### Update Frontend API Calls

In your React frontend, update the auth context and API calls to use the Flask backend:

```typescript
// src/contexts/AuthContext.tsx
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Configure axios defaults
axios.defaults.baseURL = API_URL;

const login = async (email: string, password: string) => {
  const response = await axios.post('/auth/login', { email, password });
  const { user, access_token } = response.data;
  
  localStorage.setItem('access_token', access_token);
  localStorage.setItem('user', JSON.stringify(user));
  
  // Set default authorization header
  axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
  
  setUser(user);
};
```

## Running the Application

### 1. Start MySQL Database

Make sure your MySQL server is running and the Linkup database is created with your schema.

### 2. Start Flask Backend

```bash
cd backend
python app.py
```

Backend will run on `http://localhost:5000`

### 3. Start React Frontend

```bash
npm run dev
```

Frontend will run on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (requires JWT)

### Tweets
- `GET /api/tweets/feed` - Get tweet feed (requires JWT)
- `POST /api/tweets` - Create tweet (requires JWT)
- `GET /api/tweets/:id` - Get specific tweet
- `DELETE /api/tweets/:id` - Delete tweet (requires JWT)

### Users
- `GET /api/users/:username` - Get user profile
- `PUT /api/users/:username` - Update profile (requires JWT)
- `GET /api/users/:username/tweets` - Get user tweets

### Follow System
- `POST /api/users/:username/follow` - Follow user (requires JWT)
- `DELETE /api/users/:username/follow` - Unfollow user (requires JWT)
- `GET /api/users/:username/followers` - Get followers
- `GET /api/users/:username/following` - Get following

### Likes
- `POST /api/tweets/:id/like` - Like tweet (requires JWT)
- `DELETE /api/tweets/:id/like` - Unlike tweet (requires JWT)

## File Upload Support

To handle media uploads (profile pictures, tweet images), add:

```python
from werkzeug.utils import secure_filename
import os

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@tweets_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        return jsonify({'url': f'/uploads/{filename}'}), 200
    
    return jsonify({'error': 'Invalid file type'}), 400
```

## Security Best Practices

1. **Use HTTPS in production**
2. **Set strong JWT secret keys**
3. **Implement rate limiting**
4. **Validate all user inputs**
5. **Use password hashing (already implemented with werkzeug)**
6. **Implement CSRF protection**
7. **Set proper CORS origins in production**

## Next Steps

1. Implement remaining models (Likes, Follows, Messages, etc.)
2. Add pagination for feed and profiles
3. Implement real-time features with Flask-SocketIO
4. Add image upload and processing
5. Implement search functionality
6. Add notification system
7. Deploy to production (AWS, Heroku, DigitalOcean, etc.)
