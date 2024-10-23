# backend/routes/admin_routes.py
from flask import Blueprint, request, jsonify
from queries import create_user, create_etextbook_query, add_chapter

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/create-faculty', methods=['POST'])
def create_faculty():
    data = request.json
    success, message = create_user(data, 'faculty')
    if success:
        return jsonify({"message": "Faculty account created successfully"}), 201
    else:
        return jsonify({"error": message}), 400

@admin_bp.route('/create-etextbook', methods=['POST'])
def create_etextbook():
    data = request.json
    success, message, eTextbookID = create_etextbook_query(data)
    if success:
        return jsonify({"message": "E-TextBook created successfully", "eTextbookID": eTextbookID}), 201
    else:
        return jsonify({"error": message}), 400
    

@admin_bp.route('/add-chapter', methods=['POST'])
def add_chapter_route():
    data = request.json
    success, message  = add_chapter(data)
    if success:
        return jsonify({"message": message}), 201
    else:
        return jsonify({"error": message}), 400