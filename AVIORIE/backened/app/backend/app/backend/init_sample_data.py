async def create_admin_user():
       # Create admin user
       admin = {
           "_id": "admin-001",
           "email": "akashsri5443@gmail.com",
           "phone": "9076679900",
           "password_hash": pwd_context.hash("akash100225\\"),
           "full_name": "Akash Sri",
           "role": "admin",
           "address": "Admin Office",
           "is_approved": True,
           "created_at": datetime.now(timezone.utc).isoformat()
       }

       try:
           await db.users.insert_one(admin)
           print("Admin user created successfully.")
       except Exception as e:
           print(f"Error creating admin user: {e}")