from typing import Optional
from bson import ObjectId
from datetime import datetime
from ..core.database import get_db, USERS_COLLECTION
from ..models.user import UserCreate, UserInDB, UserResponse
from ..core.auth import AuthManager

class UserService:
    @staticmethod
    async def create_user(user_data: UserCreate) -> UserResponse:
        """Create a new user"""
        db = get_db()
        
        # Check if user already exists
        existing_user = db[USERS_COLLECTION].find_one({"email": user_data.email})
        if existing_user:
            raise ValueError("User with this email already exists")
        
        # Hash password
        hashed_password = AuthManager.get_password_hash(user_data.password)
        
        # Create user document
        user_doc = {
            "email": user_data.email,
            "full_name": user_data.full_name,
            "hashed_password": hashed_password,
            "created_at": datetime.utcnow(),
            "is_active": True
        }
        
        # Insert user
        result = db[USERS_COLLECTION].insert_one(user_doc)
        user_doc["_id"] = result.inserted_id
        
        return UserResponse(**user_doc)
    
    @staticmethod
    async def authenticate_user(email: str, password: str) -> Optional[UserInDB]:
        """Authenticate user with email and password"""
        db = get_db()
        
        user = db[USERS_COLLECTION].find_one({"email": email})
        if not user:
            return None
        
        if not AuthManager.verify_password(password, user["hashed_password"]):
            return None
        
        return UserInDB(**user)
    
    @staticmethod
    async def get_user_by_email(email: str) -> Optional[UserInDB]:
        """Get user by email"""
        db = get_db()
        
        user = db[USERS_COLLECTION].find_one({"email": email})
        if not user:
            return None
        
        return UserInDB(**user)
    
    @staticmethod
    async def get_user_by_id(user_id: str) -> Optional[UserInDB]:
        """Get user by ID"""
        db = get_db()
        
        try:
            user = db[USERS_COLLECTION].find_one({"_id": ObjectId(user_id)})
            if not user:
                return None
            
            return UserInDB(**user)
        except:
            return None
