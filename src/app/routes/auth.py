from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
from typing import Optional

from ..models.user import UserCreate, UserResponse, UserLogin
from ..services.user_service import UserService
from ..core.auth import AuthManager
from ..core.database import Database

router = APIRouter(prefix="/auth", tags=["authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

# Dependency to get current user
async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get current authenticated user"""
    try:
        payload = AuthManager.verify_token(token)
        email: str = payload.get("sub")
        
        user = await UserService.get_user_by_email(email)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        return user
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    """Register a new user"""
    try:
        # Connect to database
        Database.connect()
        
        # Create user
        user = await UserService.create_user(user_data)
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )

@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login user and return access token"""
    try:
        # Connect to database
        Database.connect()
        
        # Authenticate user
        user = await UserService.authenticate_user(form_data.username, form_data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=30)
        access_token = AuthManager.create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(user.id),
                "email": user.email,
                "full_name": user.full_name
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )

@router.post("/login", response_model=dict)
async def login_with_email(login_data: UserLogin):
    """Login user with email and password"""
    try:
        # Connect to database
        Database.connect()
        
        # Authenticate user
        user = await UserService.authenticate_user(login_data.email, login_data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=30)
        access_token = AuthManager.create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(user.id),
                "email": user.email,
                "full_name": user.full_name
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user = Depends(get_current_user)):
    """Get current user information"""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        created_at=current_user.created_at,
        is_active=current_user.is_active
    )

@router.post("/logout")
async def logout():
    """Logout user (client-side token removal)"""
    return {"message": "Successfully logged out"}
