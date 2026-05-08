from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import timedelta

from models import (
    Contact, ContactCreate, Review, ReviewCreate, 
    AdminUser, AdminLogin, Token
)
from auth import (
    verify_password, get_password_hash, create_access_token, verify_token
)
from email_service import send_contact_notification, send_review_notification

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Collections
contacts_collection = db.contacts
reviews_collection = db.reviews
admins_collection = db.admins

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize admin user on startup
@app.on_event("startup")
async def create_admin_user():
    admin_email = os.environ.get("ADMIN_EMAIL", "craftmywebsite1@gmail.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "aasthablisscafeadmin")
    
    existing_admin = await admins_collection.find_one({"email": admin_email})
    if not existing_admin:
        hashed_password = get_password_hash(admin_password)
        admin_user = AdminUser(
            email=admin_email,
            hashed_password=hashed_password
        )
        await admins_collection.insert_one(admin_user.dict())
        logger.info(f"Admin user created: {admin_email}")
    else:
        logger.info(f"Admin user already exists: {admin_email}")

# Dependency to verify admin token
async def verify_admin_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    email = verify_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    admin = await admins_collection.find_one({"email": email})
    if not admin:
        raise HTTPException(status_code=401, detail="Admin not found")
    
    return email

# ============= PUBLIC ENDPOINTS =============

@api_router.get("/")
async def root():
    return {"message": "Astha Bliss Cafe API"}

# Contact Form Endpoints
@api_router.post("/contact", response_model=dict)
async def create_contact(contact_data: ContactCreate):
    try:
        contact = Contact(**contact_data.dict())
        await contacts_collection.insert_one(contact.dict())
        
        # Send email notification
        await send_contact_notification(contact.dict())
        
        logger.info(f"New contact submission from {contact.email}")
        return {
            "success": True,
            "message": "Thank you for contacting us! We'll get back to you soon.",
            "id": contact.id
        }
    except Exception as e:
        logger.error(f"Error creating contact: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to submit contact form")

# Review Endpoints
@api_router.post("/reviews", response_model=dict)
async def create_review(review_data: ReviewCreate):
    try:
        review = Review(**review_data.dict())
        await reviews_collection.insert_one(review.dict())
        
        # Send email notification
        await send_review_notification(review.dict())
        
        logger.info(f"New review submission from {review.name}")
        return {
            "success": True,
            "message": "Thank you for your review! It will be published after approval.",
            "reviewId": review.id
        }
    except Exception as e:
        logger.error(f"Error creating review: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to submit review")

@api_router.get("/reviews", response_model=List[Review])
async def get_reviews(limit: int = 100):
    try:
        # Only return approved reviews
        reviews = await reviews_collection.find(
            {"approved": True}
        ).sort("created_at", -1).limit(limit).to_list(limit)
        return [Review(**review) for review in reviews]
    except Exception as e:
        logger.error(f"Error fetching reviews: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch reviews")

# ============= AUTHENTICATION ENDPOINTS =============

@api_router.post("/auth/login", response_model=Token)
async def login(login_data: AdminLogin):
    admin = await admins_collection.find_one({"email": login_data.email})
    if not admin or not verify_password(login_data.password, admin["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(data={"sub": admin["email"]})
    logger.info(f"Admin logged in: {admin['email']}")
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.get("/auth/verify")
async def verify_auth(email: str = Depends(verify_admin_token)):
    return {"authenticated": True, "email": email}

# ============= ADMIN ENDPOINTS =============

@api_router.get("/admin/contacts", response_model=List[Contact])
async def get_all_contacts(
    email: str = Depends(verify_admin_token),
    limit: int = 100
):
    try:
        contacts = await contacts_collection.find().sort("created_at", -1).limit(limit).to_list(limit)
        return [Contact(**contact) for contact in contacts]
    except Exception as e:
        logger.error(f"Error fetching contacts: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch contacts")

@api_router.put("/admin/contacts/{contact_id}/read")
async def mark_contact_read(
    contact_id: str,
    email: str = Depends(verify_admin_token)
):
    try:
        result = await contacts_collection.update_one(
            {"id": contact_id},
            {"$set": {"read": True}}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Contact not found")
        return {"success": True}
    except Exception as e:
        logger.error(f"Error marking contact as read: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update contact")

@api_router.delete("/admin/contacts/{contact_id}")
async def delete_contact(
    contact_id: str,
    email: str = Depends(verify_admin_token)
):
    try:
        result = await contacts_collection.delete_one({"id": contact_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Contact not found")
        return {"success": True}
    except Exception as e:
        logger.error(f"Error deleting contact: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete contact")

@api_router.get("/admin/reviews", response_model=List[Review])
async def get_all_reviews(
    email: str = Depends(verify_admin_token),
    limit: int = 100
):
    try:
        reviews = await reviews_collection.find().sort("created_at", -1).limit(limit).to_list(limit)
        return [Review(**review) for review in reviews]
    except Exception as e:
        logger.error(f"Error fetching reviews: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch reviews")

@api_router.put("/admin/reviews/{review_id}/approve")
async def approve_review(
    review_id: str,
    email: str = Depends(verify_admin_token)
):
    try:
        result = await reviews_collection.update_one(
            {"id": review_id},
            {"$set": {"approved": True}}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Review not found")
        logger.info(f"Review approved: {review_id}")
        return {"success": True}
    except Exception as e:
        logger.error(f"Error approving review: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to approve review")

@api_router.delete("/admin/reviews/{review_id}")
async def delete_review(
    review_id: str,
    email: str = Depends(verify_admin_token)
):
    try:
        result = await reviews_collection.delete_one({"id": review_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Review not found")
        logger.info(f"Review deleted: {review_id}")
        return {"success": True}
    except Exception as e:
        logger.error(f"Error deleting review: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete review")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
