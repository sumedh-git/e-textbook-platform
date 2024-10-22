# backend/routes/admin_routes.py
from flask import Blueprint, request, jsonify
from queries import create_user

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/create-faculty', methods=['POST'])
def create_faculty():
    data = request.json
    success, message = create_user(data, 'faculty')
    if success:
        return jsonify({"message": "Faculty account created successfully"}), 201
    else:
        return jsonify({"error": message}), 400
