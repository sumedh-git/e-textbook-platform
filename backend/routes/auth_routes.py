# backend/routes/auth_routes.py
from flask import Blueprint, request, jsonify
from queries import get_user_by_credentials,check_admin_role, check_faculty_role, check_student_role, check_ta_role, change_user_password
from utils.validation import validate_login_input
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    is_valid, error_message = validate_login_input(data)
    if not is_valid:
        return jsonify({"error": error_message}), 400
    
    user = get_user_by_credentials(data['user_id'], data['password'])
    if not user:
        return jsonify({"error": "Login Incorrect"}), 401
    
    role = data['role'].capitalize()  # Role from the frontend (admin, faculty, student)
    
    # Check in the role-specific table
    if role == "Admin":
        is_valid_role = check_admin_role(user['UserID'])
    elif role == "Faculty":
        is_valid_role = check_faculty_role(user['UserID'])
    elif role == "Student":
        is_valid_role = check_student_role(user['UserID'])
    elif role == "Ta":
        is_valid_role = check_ta_role(user['UserID'])
    else:
        return jsonify({"error": "Invalid role"}), 403

    if not is_valid_role:
        return jsonify({"error": f"User is not a {role}"}), 403

    # Success response with the role
    return jsonify({
        "message": "Login successful",
        "user": {
            "user_id": user['UserID'],
            "first_name": user['FirstName'],
            "last_name": user['LastName'],
            "role": role
        }
    })

@auth_bp.route('/change-password', methods=['POST'])
def change_password():
    data = request.json
    user_id = data.get('user_id')
    old_password = data.get('current_password')
    new_password = data.get('new_password')
    print(user_id, old_password)

    # Check if the user exists and the old password is correct
    user = get_user_by_credentials(user_id, old_password)
    if not user:
        print("ITHE AHE ERROR")
        return jsonify({"error": "Old password is incorrect or user does not exist."}), 401

    # Update the password
    success, message = change_user_password(user_id, new_password)
    if not success:
        return jsonify({"error": message}), 500

    return jsonify({"message": "Password changed successfully."}), 200
