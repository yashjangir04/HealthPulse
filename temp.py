import os
import ast
import re
from importlib.metadata import version, PackageNotFoundError

def get_imports_from_file(file_path):
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        try:
            tree = ast.parse(f.read())
        except SyntaxError:
            return set()
            
    imports = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for name in node.names:
                imports.add(name.name.split('.')[0])
        elif isinstance(node, ast.ImportFrom):
            if node.module:
                imports.add(node.module.split('.')[0])
    return imports

def scan_project(root_dir):
    all_imports = set()
    for root, dirs, files in os.walk(root_dir):
        # Skip virtual environments and hidden folders
        if any(x in root for x in ["venv", ".git", "__pycache__", "node_modules", "env", ".env"]):
            continue
            
        for file in files:
            if file.endswith(".py"):
                file_path = os.path.join(root, file)
                all_imports.update(get_imports_from_file(file_path))
    
    # Map common import names to pip package names
    mapping = {
        "cv2": "opencv-python-headless",
        "PIL": "Pillow",
        "dotenv": "python-dotenv",
        "sklearn": "scikit-learn",
        "sentence_transformers": "sentence-transformers",
        "langchain_community": "langchain-community",
        "langchain_chroma": "langchain-chroma",
        "langchain_huggingface": "langchain-huggingface",
        "langchain_groq": "langchain-groq",
        "langchain_core": "langchain-core",
        "langchain_text_splitters": "langchain-text-splitters",
        "thefuzz": "thefuzz",
        "sarvamai": "sarvamai",
        "bs4": "beautifulsoup4",
        "yaml": "PyYAML"
    }
    
    pip_packages = set()
    for imp in all_imports:
        if imp in mapping:
            pip_packages.add(mapping[imp])
        else:
            pip_packages.add(imp)
            
    # Filter out standard library (rough estimation)
    std_libs = {
        "os", "sys", "re", "json", "time", "io", "tempfile", "traceback", 
        "importlib", "ast", "math", "datetime", "uuid", "logging", "typing",
        "random", "collections", "itertools", "functools", "pathlib", "subprocess",
        "argparse", "hashlib", "urllib", "base64", "csv", "sqlite3"
    }
    final_packages = pip_packages - std_libs
    
    return sorted(list(final_packages))

def get_package_versions(packages):
    requirements_with_versions = []
    for pkg in packages:
        try:
            # Attempt to find the version in the active environment
            pkg_version = version(pkg)
            requirements_with_versions.append(f"{pkg}=={pkg_version}")
        except PackageNotFoundError:
            # If the package isn't installed (or is a built-in we missed),
            # just append the name without a version.
            requirements_with_versions.append(pkg)
    return requirements_with_versions

if __name__ == "__main__":
    project_root = os.path.dirname(os.path.abspath(__file__))
    print(f"Scanning project for Python dependencies in: {project_root}")
    
    # 1. Get the list of packages
    libs = scan_project(project_root)
    
    # 2. Append versions to the packages
    libs_with_versions = get_package_versions(libs)
    
    print("\n--- Required Libraries for this Project ---")
    for lib in libs_with_versions:
        print(lib)
        
    with open("project_requirements.txt", "w") as f:
        f.write("\n".join(libs_with_versions))
    
    print("\n[SUCCESS] List saved to: project_requirements.txt")