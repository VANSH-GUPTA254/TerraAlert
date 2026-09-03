from fastapi import APIRouter, HTTPException, status
from schemas import UserLogin, UserRegister, TokenResponse, UserOut
from database import db
import secrets

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin):
    user = db.find_user_by_email(credentials.email)
    if not user:
        # In demo mode, if matching predefined sample accounts or password matches demo
        if credentials.email in ["admin@aquavision.gov.in", "officer@aquavision.gov.in", "citizen@aquavision.gov.in"]:
            role = "admin" if "admin" in credentials.email else ("officer" if "officer" in credentials.email else "citizen")
            name = "Disaster Admin" if role == "admin" else ("SDMA Officer" if role == "officer" else "Field Citizen")
            user = db.create_user({
                "name": name,
                "email": credentials.email,
                "role": role,
                "password_hash": "mock",
                "phone": "+91 98765 43210",
                "department": "National Disaster Response"
            })
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password. You may use demo accounts: admin@aquavision.gov.in, officer@aquavision.gov.in, citizen@aquavision.gov.in"
            )

    token = f"aqv_{secrets.token_hex(24)}"
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserOut(
            id=user["id"],
            name=user["name"],
            email=user["email"],
            role=user["role"],
            phone=user.get("phone"),
            department=user.get("department"),
            jurisdiction_district=user.get("jurisdiction_district"),
            created_at=user.get("created_at", "")
        )
    )

@router.post("/register", response_model=TokenResponse)
def register(data: UserRegister):
    existing = db.find_user_by_email(data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    user_dict = {
        "name": data.name,
        "email": data.email,
        "role": data.role,
        "password_hash": "mock_hash",
        "phone": data.phone,
        "department": data.department or ("Citizen Reporter" if data.role == "citizen" else "District Emergency Office"),
        "jurisdiction_district": data.jurisdiction_district or "All Regions"
    }
    created = db.create_user(user_dict)
    token = f"aqv_{secrets.token_hex(24)}"

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserOut(
            id=created["id"],
            name=created["name"],
            email=created["email"],
            role=created["role"],
            phone=created.get("phone"),
            department=created.get("department"),
            jurisdiction_district=created.get("jurisdiction_district"),
            created_at=created.get("created_at", "")
        )
    )

@router.get("/me", response_model=UserOut)
def get_current_user_profile():
    # Return default officer demo profile
    user = db.users[1]
    return UserOut(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        role=user["role"],
        phone=user.get("phone"),
        department=user.get("department"),
        jurisdiction_district=user.get("jurisdiction_district"),
        created_at=user.get("created_at", "")
    )
