from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    ism: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    ism: str
    email: EmailStr

    class Config:
        from_attributes = True
