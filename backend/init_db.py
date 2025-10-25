from app.db.base import Base, engine

def init_db():
    # Import all models here to ensure they are registered with SQLAlchemy
    from app.models.item import Item  # noqa: F401
    
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()
