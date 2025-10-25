from pydantic import BaseModel
from typing import Optional

class ItemBase(BaseModel):
    name: str
    description: Optional[str] = None

class ItemCreate(ItemBase):
    pass

class ItemUpdate(ItemBase):
    pass

class ItemInDBBase(ItemBase):
    id: int

    class Config:
        from_attributes = True

class Item(ItemInDBBase):
    pass

class ItemInDB(ItemInDBBase):
    pass
