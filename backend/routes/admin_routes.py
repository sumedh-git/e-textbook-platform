# backend/routes/admin_routes.py
from flask import Blueprint, request, jsonify
from queries import create_user, create_etextbook_query, add_chapter, add_section, add_content_block, add_activity

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
        return jsonify({"message": message, "eTextbookID": eTextbookID}), 201
    else:
        return jsonify({"error": message}), 400
    

@admin_bp.route('/add-chapter', methods=['POST'])
def add_chapter_route():
    data = request.json
    success, message, chapterID  = add_chapter(data)
    if success:
        return jsonify({"message": message, "chapterID": chapterID}), 201
    else:
        return jsonify({"error": message}), 400

@admin_bp.route('/add-section', methods=['POST'])
def add_section_route():
    data = request.json
    success, message, sectionID  = add_section(data)
    if success:
        return jsonify({"message": message, "sectionID": sectionID}), 201
    else:
        return jsonify({"error": message}), 400
    
@admin_bp.route('/add-content-block', methods=['POST'])
def add_content_block_route():
    data = request.json
    success, message  = add_content_block(data)
    if success:
        return jsonify({"message": message}), 201
    else:
        return jsonify({"error": message}), 400
    
@admin_bp.route('/add-activity', methods=['POST'])
def add_activity_route():
    data = request.json
    success, message = add_activity(section_id, content_block_id, activity_id)
    if success:
        return jsonify({"message": message}), 201
    else:
        return jsonify({"error": message}), 400