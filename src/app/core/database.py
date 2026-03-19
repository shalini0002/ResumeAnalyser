from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "resume_analyzer")

class Database:
    client = None
    database = None
    
    @classmethod
    def connect(cls):
        """Connect to MongoDB"""
        try:
            cls.client = MongoClient(MONGODB_URL)
            cls.database = cls.client[DB_NAME]
            # Test connection
            cls.client.admin.command('ping')
            print(f"✅ Connected to MongoDB: {DB_NAME}")
            return True
        except ConnectionFailure as e:
            print(f"❌ MongoDB connection failed: {e}")
            return False
    
    @classmethod
    def get_db(cls):
        """Get database instance"""
        if cls.database is None:
            cls.connect()
        return cls.database
    
    @classmethod
    def disconnect(cls):
        """Close MongoDB connection"""
        if cls.client:
            cls.client.close()
            cls.client = None
            cls.database = None
            print("🔌 MongoDB connection closed")

# Helper function for services
def get_db():
    """Get database instance"""
    return Database.get_db()

# Collections
USERS_COLLECTION = "users"
