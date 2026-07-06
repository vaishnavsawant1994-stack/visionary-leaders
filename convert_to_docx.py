#!/usr/bin/env python3
import os

# Try to import and use python-docx
try:
    from docx import Document
    from docx.shared import Inches, Pt, RGBColor
    from docx.enum.text import WD_PARAGRAPH_ALIGNMENT
    from docx.oxml.ns import qn
    from docx.oxml import OxmlElement
    docx_available = True
except ImportError:
    docx_available = False
    print("Note: python-docx not available, using alternative method...")

if docx_available:
    from datetime import datetime

    # Create document
    doc = Document()

    # Set margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)

    # Read the markdown file
    with open(r"c:\Users\Admin\magazine-platform\Magazine_Platform_Professional_Report.md", 'r', encoding='utf-8') as f:
        content = f.read()

    # Parse and add content
    lines = content.split('\n')
    for line in lines:
        if line.startswith('# '):
            heading = doc.add_heading(line[2:], level=1)
            for run in heading.runs:
                run.font.color.rgb = RGBColor(31, 78, 121)
        elif line.startswith('## '):
            doc.add_heading(line[3:], level=2)
        elif line.startswith('### '):
            doc.add_heading(line[4:], level=3)
        elif line.startswith('| '):
            # Skip markdown table separator, handle actual parsing elsewhere
            pass
        elif line.strip() == '':
            doc.add_paragraph()
        elif line.startswith('- '):
            doc.add_paragraph(line[2:], style='List Bullet')
        elif line.startswith('✓ '):
            doc.add_paragraph(line[2:], style='List Bullet')
        elif line.startswith('*') or line.startswith('_'):
            # Skip markdown formatting markers
            pass
        else:
            if line.strip():
                doc.add_paragraph(line)

    # Save the document
    output_path = r"c:\Users\Admin\magazine-platform\Magazine_Platform_Professional_Report.docx"
    doc.save(output_path)
    print(f"✓ Professional report generated successfully!")
    print(f"✓ Location: {output_path}")
else:
    # Fallback: use python-docx installation
    import subprocess
    import sys
    
    # Install python-docx
    subprocess.check_call([sys.executable, "-m", "pip", "install", "python-docx", "-q"])
    print("✓ Dependencies installed")
    
    # Retry import
    from docx import Document
    from docx.shared import Inches, Pt, RGBColor
    from docx.enum.text import WD_PARAGRAPH_ALIGNMENT
    
    doc = Document()
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)
    
    with open(r"c:\Users\Admin\magazine-platform\Magazine_Platform_Professional_Report.md", 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    for line in lines:
        if line.startswith('# '):
            heading = doc.add_heading(line[2:], level=1)
        elif line.startswith('## '):
            doc.add_heading(line[3:], level=2)
        elif line.startswith('### '):
            doc.add_heading(line[4:], level=3)
        elif line.strip() == '':
            doc.add_paragraph()
        elif line.startswith('- '):
            doc.add_paragraph(line[2:], style='List Bullet')
        elif line.strip():
            doc.add_paragraph(line)
    
    output_path = r"c:\Users\Admin\magazine-platform\Magazine_Platform_Professional_Report.docx"
    doc.save(output_path)
    print(f"✓ Report generated: {output_path}")
