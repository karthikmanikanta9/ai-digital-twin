import re

def fix_fetch(content):
    # This regex matches .catch(...) followed by a block or inline
    # We will just replace ALL simple .catch(err => console... ) with the requested format
    # Instead of regex, let's replace specific patterns we know exist in the files
    
    replacements = [
        (
            ".catch(err => console.error(\"Auth error:\", err));",
            ".catch(err => {\n        console.error(\"Auth error:\", err);\n        showToast('Something went wrong. Please try again.', 'error');\n    });"
        ),
        (
            ".catch(err => console.error(\"Error fetching simulation data:\", err));",
            ".catch(err => {\n        console.error(err);\n        showToast('Something went wrong. Please try again.', 'error');\n    });"
        ),
        (
            ".catch(e => console.log('No tracker data yet', e));",
            ".catch(err => {\n        console.error(err);\n        showToast('Something went wrong. Please try again.', 'error');\n    });"
        ),
        (
            ".catch(() => {\n                applySleepLock(false, '');\n                renderSleepUI(sleepHours);\n            });",
            ".catch(err => {\n                console.error(err);\n                showToast('Something went wrong. Please try again.', 'error');\n                applySleepLock(false, '');\n                renderSleepUI(sleepHours);\n            });"
        ),
        (
            ".catch(() => {});",
            ".catch(err => {\n            console.error(err);\n            showToast('Something went wrong. Please try again.', 'error');\n        });"
        ),
        (
            ".catch(err => console.log(\"Failed to sync:\", err));",
            ".catch(err => {\n        console.error(err);\n        showToast('Something went wrong. Please try again.', 'error');\n    });"
        ),
        (
            ".catch(err => console.log('Using local state: ' + err));",
            ".catch(err => {\n            console.error(err);\n            showToast('Something went wrong. Please try again.', 'error');\n        });"
        ),
    ]
    for old, new in replacements:
        content = content.replace(old, new)
        
    return content

def add_showtoast(content):
    if "function showToast" not in content:
        toast = """
function showToast(message, type='info') {
    let toast = document.getElementById('global-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'global-toast';
        toast.style.cssText = 'position:fixed; top:20px; left:50%; transform:translateX(-50%); padding:12px 20px; border-radius:8px; z-index:9999; color:white; font-weight:bold; box-shadow:0 4px 12px rgba(0,0,0,0.5); cursor:pointer; min-width:250px; text-align:center; transition: opacity 0.3s;';
        document.body.appendChild(toast);
        toast.addEventListener('click', () => { toast.style.display = 'none'; });
    }
    toast.style.display = 'block';
    toast.style.opacity = '1';
    toast.textContent = message;
    toast.style.background = (type === 'error') ? 'var(--danger, #ff0055)' : 'var(--primary, #00f0ff)';
    toast.style.color = (type === 'error') ? '#fff' : '#000';
    setTimeout(() => { 
        toast.style.opacity = '0'; 
        setTimeout(() => { toast.style.display = 'none'; }, 300); 
    }, 3000);
}
"""
        content += toast
    return content

def process_script_js():
    with open('static/script.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Inject helpers
    if 'function safeSet(' not in content:
        helper = '''    function safeSet(el, prop, val) {
        if (el) el[prop] = val;
    }
    function safeStyle(el, prop, val) {
        if (el && el.style) el.style[prop] = val;
    }
'''
        content = content.replace('document.addEventListener("DOMContentLoaded", () => {\n', 'document.addEventListener("DOMContentLoaded", () => {\n' + helper)

    # 2. Add showToast
    content = add_showtoast(content)

    # 3. Replace direct DOM manipulations
    # Instead of fragile regex, we'll replace known bad patterns specifically, or use a line-level regex
    lines = content.split('\n')
    new_lines = []
    
    prop_replacements = ['textContent', 'innerHTML', 'value', 'required', 'disabled', 'src', 'className']
    
    for line in lines:
        stripped = line.strip()
        # skip complex html backtick assignments
        if 'card.innerHTML =' in line or 'card.style.cssText' in line:
            new_lines.append(line)
            continue
            
        modified = False
        
        # Match style assignments e.g. elements.heartBar.style.width = val + '%';
        # re.sub(r'([a-zA-Z0-9_\.]+)\.style\.([a-zA-Z0-9_-]+)\s*=\s*(.+?);', r'safeStyle(\1, "\2", \3);')
        m = re.search(r'^(\s*)([a-zA-Z0-9_\[\]\.]+)\.style\.([a-zA-Z0-9_-]+)\s*=\s*(.+?);?$', line)
        if m:
            indent, el, prop, val = m.groups()
            new_lines.append(f"{indent}safeStyle({el}, '{prop}', {val});")
            modified = True
            continue
            
        # Match general properties
        for prop in prop_replacements:
            m = re.search(r'^(\s*)([a-zA-Z0-9_\[\]\.]+)\.' + prop + r'\s*=\s*(.+?);?$', line)
            if m:
                indent, el, val = m.groups()
                new_lines.append(f"{indent}safeSet({el}, '{prop}', {val});")
                modified = True
                break
                
        if not modified:
            new_lines.append(line)

    content = '\n'.join(new_lines)
    
    content = fix_fetch(content)

    with open('static/script.js', 'w', encoding='utf-8') as f:
        f.write(content)

def process_tracker_app():
    with open('static/tracker_app.js', 'r', encoding='utf-8') as f:
        content = f.read()
    content = fix_fetch(content)
    with open('static/tracker_app.js', 'w', encoding='utf-8') as f:
        f.write(content)

def process_workout_app():
    with open('static/workout_app.js', 'r', encoding='utf-8') as f:
        content = f.read()
    content = fix_fetch(content)
    content = add_showtoast(content)
    with open('static/workout_app.js', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    process_script_js()
    process_tracker_app()
    process_workout_app()
    print("Success")
