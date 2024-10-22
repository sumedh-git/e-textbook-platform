# backend/utils/validation.py
def validate_login_input(data):
    if not data.get('user_id') or not data.get('password'):
        return False, "User ID and Password are required"
    return True, None