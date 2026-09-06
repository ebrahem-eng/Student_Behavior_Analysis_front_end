import subprocess
import os
import sys

md_file = "USER_MANUAL_AR.md"
html_file = "USER_MANUAL_AR.html"
pdf_file = "USER_MANUAL_AR.pdf"

if not os.path.exists(md_file):
    print(f"Error: {md_file} not found!")
    sys.exit(1)

# 1. Run pandoc to get HTML body
cmd_pandoc = ["pandoc", md_file, "-f", "markdown", "-t", "html5", "--mathjax"]
result = subprocess.run(cmd_pandoc, capture_output=True, text=True)
if result.returncode != 0:
    print("Pandoc error:", result.stderr)
    sys.exit(1)

body_html = result.stdout

# 2. Build full HTML document with styling, KaTeX/MathJax, and Mermaid
html_content = f"""<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <title>دليل استخدام المنظومة - SBA Platform</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Fira+Code:wght@400;600&display=swap" rel="stylesheet">
  
  <!-- MathJax for rendering LaTeX formulas -->
  <script>
    window.MathJax = {{
      tex: {{
        inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
        displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']]
      }},
      chtml: {{
        scale: 1.05
      }}
    }};
  </script>
  <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

  <!-- Mermaid.js for diagrams -->
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>

  <style>
    @page {{
      size: A4;
      margin: 18mm 14mm 18mm 14mm;
      @bottom-right {{
        content: "منصة SBA لتحليل سلوك الطلاب والتنبؤ بالتعثر";
        font-family: 'Cairo', sans-serif;
        font-size: 8pt;
        color: #64748b;
      }}
      @bottom-left {{
        content: counter(page);
        font-family: 'Cairo', sans-serif;
        font-size: 8pt;
        font-weight: bold;
        color: #2563eb;
      }}
    }}

    * {{
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }}

    body {{
      font-family: 'Cairo', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.85;
      color: #1e293b;
      background-color: #ffffff;
      padding: 0;
      margin: 0;
      font-size: 10.5pt;
      direction: rtl;
      text-align: right;
    }}

    /* Headers */
    h1, h2, h3, h4, h5, h6 {{
      font-family: 'Cairo', sans-serif;
      color: #0f172a;
      font-weight: 800;
      page-break-after: avoid;
      break-after: avoid;
    }}

    h1 {{
      font-size: 20pt;
      color: #1e3a8a;
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 8px;
      margin-top: 24pt;
      margin-bottom: 12pt;
      line-height: 1.4;
    }}

    h2 {{
      font-size: 15pt;
      color: #1e40af;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 6px;
      margin-top: 20pt;
      margin-bottom: 10pt;
      page-break-before: auto;
    }}

    h3 {{
      font-size: 12.5pt;
      color: #0369a1;
      margin-top: 14pt;
      margin-bottom: 8pt;
    }}

    h4 {{
      font-size: 11pt;
      color: #334155;
      margin-top: 10pt;
      margin-bottom: 6pt;
    }}

    p {{
      margin-top: 0;
      margin-bottom: 8pt;
      text-align: justify;
    }}

    /* Tables */
    table {{
      width: 100%;
      border-collapse: collapse;
      margin: 14pt 0;
      font-size: 9pt;
      page-break-inside: avoid;
      break-inside: avoid;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #cbd5e1;
    }}

    th, td {{
      padding: 7pt 10pt;
      text-align: right;
      border: 1px solid #cbd5e1;
      vertical-align: middle;
    }}

    th {{
      background-color: #f1f5f9;
      color: #0f172a;
      font-weight: 800;
    }}

    tr:nth-child(even) {{
      background-color: #f8fafc;
    }}

    /* Code and Math blocks */
    code {{
      font-family: 'Fira Code', monospace;
      font-size: 9pt;
      background-color: #f1f5f9;
      color: #be185d;
      padding: 1.5pt 4pt;
      border-radius: 4px;
      direction: ltr;
      display: inline-block;
    }}

    pre {{
      background-color: #0f172a;
      color: #f8fafc;
      padding: 10pt;
      border-radius: 8px;
      overflow-x: auto;
      font-size: 8.5pt;
      direction: ltr;
      text-align: left;
      page-break-inside: avoid;
    }}

    pre code {{
      background: none;
      color: inherit;
      padding: 0;
      display: block;
    }}

    /* Math Formulas without gray background */
    .math.display, mjx-container[display="true"] {{
      margin: 12pt 0 !important;
      padding: 6pt !important;
      background: transparent !important;
      border: none !important;
      text-align: center !important;
      page-break-inside: avoid;
      direction: ltr;
    }}

    .math.inline, mjx-container:not([display="true"]) {{
      background: transparent !important;
      border: none !important;
    }}

    /* Mermaid Diagrams */
    .mermaid {{
      margin: 14pt auto;
      text-align: center;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 12pt;
      page-break-inside: avoid;
      break-inside: avoid;
    }}

    .mermaid svg {{
      max-width: 100% !important;
      height: auto !important;
    }}

    /* Blockquotes / Callouts */
    blockquote {{
      border-right: 4px solid #3b82f6;
      border-left: none;
      margin: 10pt 0;
      padding: 8pt 14pt;
      background-color: #eff6ff;
      color: #1e3a8a;
      border-radius: 4px;
      page-break-inside: avoid;
    }}

    ul, ol {{
      padding-right: 20px;
      margin-top: 4pt;
      margin-bottom: 8pt;
    }}

    li {{
      margin-bottom: 4pt;
    }}

    hr {{
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 18pt 0;
    }}

    strong {{
      color: #0f172a;
      font-weight: 700;
    }}
  </style>
</head>
<body>

{body_html}

<script>
  // Convert pre.mermaid to div.mermaid and run mermaid
  document.addEventListener("DOMContentLoaded", async function() {{
    const mermaidNodes = document.querySelectorAll('pre.mermaid');
    mermaidNodes.forEach((el) => {{
      const code = el.querySelector('code') ? el.querySelector('code').innerText : el.innerText;
      const div = document.createElement('div');
      div.className = 'mermaid';
      div.textContent = code;
      el.parentNode.replaceChild(div, el);
    }});

    mermaid.initialize({{
      startOnLoad: false,
      theme: 'neutral',
      fontFamily: 'Cairo, sans-serif',
      fontSize: '13px',
      securityLevel: 'loose',
      flowchart: {{
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      }}
    }});

    try {{
      await mermaid.run();
    }} catch (e) {{
      console.warn("Mermaid run error:", e);
    }}

    window.__RENDER_COMPLETE__ = true;
  }});
</script>
</body>
</html>
"""

# Write HTML file
with open(html_file, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Generated HTML: {html_file}")

# 3. Use Headless Google Chrome to convert to PDF
chrome_path = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if not os.path.exists(chrome_path):
    print(f"Error: Chrome not found at {chrome_path}")
    sys.exit(1)

cmd_chrome = [
    chrome_path,
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--run-all-compositor-stages-before-draw",
    "--virtual-time-budget=10000",
    f"--print-to-pdf={pdf_file}",
    os.path.abspath(html_file)
]

print("Rendering PDF via Google Chrome headless...")
res_chrome = subprocess.run(cmd_chrome, capture_output=True, text=True)
if os.path.exists(pdf_file) and os.path.getsize(pdf_file) > 10000:
    size_kb = os.path.getsize(pdf_file) / 1024
    print(f"Success! PDF created successfully: {pdf_file} ({size_kb:.1f} KB)")
else:
    print("Failed to generate PDF or PDF file is too small.")
    print("Stderr:", res_chrome.stderr)
    sys.exit(1)
