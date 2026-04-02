import re
import os

def process_script_js():
    file_path = 'static/script.js'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    helper_funcs = """    function safeSet(el, prop, val) {
        if (el) el[prop] = val;
    }
    function safeStyle(el, prop, val) {
        if (el && el.style) el.style[prop] = val;
    }\n
    function showToast(message, type='info') {
        let toast = document.getElementById('global-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'global-toast';
            toast.style.cssText = 'position:fixed; top:20px; left:50%; transform:translateX(-50%); padding:12px 20px; border-radius:8px; z-index:9999; color:white; font-weight:bold; box-shadow:0 4px 12px rgba(0,0,0,0.5); cursor:pointer; min-width:250px; text-align:center; transition: opacity 0.3s;';
            document.body.appendChild(toast);
            toast.addEventListener('click', () => toast.style.display = 'none');
        }
        toast.style.display = 'block';
        toast.style.opacity = '1';
        toast.textContent = message;
        toast.style.background = type === 'error' ? 'var(--danger)' : 'var(--primary)';
        toast.style.color = type === 'error' ? 'white' : 'black';
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.style.display = 'none', 300); }, 3000);
    }\n"""

    if "function safeSet(el, prop, val)" not in content:
        content = content.replace('document.addEventListener("DOMContentLoaded", () => {\n', 'document.addEventListener("DOMContentLoaded", () => {\n' + helper_funcs)

    # 1. Replace style assignments
    # Match something.style.property = value;
    content = re.sub(r'([a-zA-Z0-9_\.]+)\.style\.([a-zA-Z0-9_-]+)\s*=\s*(.+?);', r'safeStyle(\1, "\2", \3);', content)

    # 2. Replace other property assignments
    props = ['textContent', 'innerHTML', 'value', 'required', 'disabled', 'src']
    for prop in props:
        content = re.sub(r'([a-zA-Z0-9_\.]+)\.' + prop + r'\s*=\s*(.+?);', r'safeSet(\1, "' + prop + r'", \2);', content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
def process_fetch(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if "function showToast" not in content and file_path != 'static/script.js':
        # add showToast to file if missing
        toast_func = """\nfunction showToast(message, type='info') {
    let toast = document.getElementById('global-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'global-toast';
        toast.style.cssText = 'position:fixed; top:20px; left:50%; transform:translateX(-50%); padding:12px 20px; border-radius:8px; z-index:9999; color:white; font-weight:bold; box-shadow:0 4px 12px rgba(0,0,0,0.5); cursor:pointer; min-width:250px; text-align:center; transition: opacity 0.3s;';
        document.body.appendChild(toast);
        toast.addEventListener('click', () => toast.style.display = 'none');
    }
    toast.style.display = 'block';
    toast.style.opacity = '1';
    toast.textContent = message;
    toast.style.background = type === 'error' ? '#f85149' : '#3fb950';
    toast.style.color = 'white';
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.style.display = 'none', 300); }, 3000);
}\n"""
        if "tracker_app.js" not in file_path:
            content += toast_func

    # find fetch patterns and replace catch blocks
    catch_str = """.catch(err => {
        console.error("Fetch error: ", err);
        showToast("Something went wrong. Please try again.", "error");
    });"""
    content = re.sub(r'\.catch\([^\)]+\)\s*=>\s*\{[^}]*\}\)?;|\.catch\([^/]+?\)(;|\n)', catch_str + '\n', content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

process_script_js()
process_fetch('static/tracker_app.js')
process_fetch('static/workout_app.js')
process_fetch('static/script.js')

print("Refactoring complete.")
