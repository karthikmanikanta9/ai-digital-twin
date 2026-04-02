with open('app.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    if 'data = request.json' in line:
        indent = len(line) - len(line.lstrip('\t '))
        spaces = ' ' * indent
        
        # Avoid duplicate insertions
        if i >= 1 and 'if not request.is_json:' in lines[i-1]:
            pass
        elif i >= 2 and 'if not request.is_json:' in lines[i-2]:
            pass
        else:
            new_lines.append(f"{spaces}if not request.is_json:\n")
            new_lines.append(f"{spaces}    return jsonify({{'error': 'JSON required'}}), 415\n")
            
    new_lines.append(line)
    
    if "file = request.files['image']" in line:
        indent = len(line) - len(line.lstrip('\t '))
        spaces = ' ' * indent
        # check if it already appended
        if i+1 < len(lines) and 'ALLOWED_MIMETYPES' in lines[i+1]:
            continue
            
        mime_code = f"{spaces}ALLOWED_MIMETYPES = {{'image/jpeg', 'image/png', 'image/webp', 'image/gif'}}\n{spaces}if file.mimetype not in ALLOWED_MIMETYPES:\n{spaces}    return jsonify({{'error': 'Only JPEG, PNG, WebP, or GIF images are allowed.'}}), 400\n"
        new_lines.append(mime_code)

with open('app.py', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print("Security patches applied.")
