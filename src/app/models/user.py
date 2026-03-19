from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: Optional[PyObjectId] = None
    created_at: datetime
    is_active: bool = True

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class UserInDB(UserBase):
    id: PyObjectId
    hashed_password: str
    created_at: datetime
    is_active: bool = True

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
