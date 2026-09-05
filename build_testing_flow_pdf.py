import subprocess
import os
import sys

md_file = "SYSTEM_TESTING_FLOW_AR.md"
html_file = "SYSTEM_TESTING_FLOW_AR.html"
pdf_file = "SYSTEM_TESTING_FLOW_AR.pdf"

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

# 2. Build full HTML document with styling, MathJax, and Mermaid
html_content = f"""<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <title>دليل سيناريو التشغيل والاختبار التكاملي الشامل - SBA Platform</title>
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
      margin: 16mm 14mm 16mm 14mm;
      @bottom-right {{
        content: "منصة SBA لتحليل سلوك الطلاب والتنبؤ بالتعثر - سيناريو الاختبار التكاملي";
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
      line-height: 1.8;
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
      font-size: 19pt;
      color: #1e3a8a;
      border-bottom: 2.5px solid #3b82f6;
      padding-bottom: 6px;
      margin-top: 22pt;
      margin-bottom: 10pt;
    }}

    h2 {{
      font-size: 14pt;
      color: #1e40af;
      border-bottom: 1.5px solid #cbd5e1;
      padding-bottom: 4px;
      margin-top: 18pt;
      margin-bottom: 8pt;
    }}

    h3 {{
      font-size: 12pt;
      color: #334155;
      margin-top: 14pt;
      margin-bottom: 6pt;
    }}

    p {{
      margin: 0 0 9pt 0;
      text-align: justify;
    }}

    /* Cover / Header section */
    .header-box {{
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      color: white;
      padding: 20px 24px;
      border-radius: 12px;
      margin-bottom: 20pt;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }}

    .header-box h1 {{
      color: #ffffff !important;
      border-bottom: none;
      margin: 0 0 6px 0;
      padding: 0;
      font-size: 20pt;
    }}

    .header-box p {{
      color: #e2e8f0;
      font-size: 10.5pt;
      margin: 0;
    }}

    /* Tables */
    table {{
      width: 100%;
      border-collapse: collapse;
      margin: 12pt 0;
      font-size: 9pt;
      page-break-inside: avoid;
      break-inside: avoid;
    }}

    th, td {{
      padding: 6pt 8pt;
      border: 1px solid #cbd5e1;
      text-align: right;
    }}

    th {{
      background-color: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
      border-bottom: 2px solid #94a3b8;
    }}

    tr:nth-child(even) {{
      background-color: #f8fafc;
    }}

    /* Blockquotes / Callouts */
    blockquote {{
      margin: 12pt 0;
      padding: 9pt 13pt;
      background-color: #eff6ff;
      border-right: 4px solid #3b82f6;
      border-left: none;
      border-radius: 6px;
      color: #1e3a8a;
      page-break-inside: avoid;
      break-inside: avoid;
    }}

    blockquote p {{
      margin: 0;
    }}

    /* Code blocks */
    code {{
      font-family: 'Fira Code', monospace;
      background-color: #f1f5f9;
      padding: 2px 5px;
      border-radius: 4px;
      font-size: 8.5pt;
      color: #0f172a;
      direction: ltr;
      display: inline-block;
    }}

    pre {{
      background-color: #0f172a;
      color: #f8fafc;
      padding: 10pt;
      border-radius: 8px;
      font-family: 'Fira Code', monospace;
      font-size: 8pt;
      overflow-x: auto;
      direction: ltr;
      text-align: left;
      margin: 10pt 0;
      line-height: 1.45;
    }}

    pre code {{
      background: none;
      color: inherit;
      padding: 0;
      display: block;
    }}

    /* Mermaid diagrams container */
    .mermaid {{
      margin: 14pt auto;
      text-align: center;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 12pt;
      page-break-inside: avoid;
      break-inside: avoid;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
      direction: ltr !important;
      display: flex;
      justify-content: center;
      align-items: center;
    }}

    .mermaid svg {{
      max-width: 100% !important;
      height: auto !important;
      display: block;
      margin: 0 auto;
      font-family: 'Cairo', sans-serif !important;
    }}

    /* Lists */
    ul, ol {{
      margin: 0 0 10pt 0;
      padding-right: 20px;
      padding-left: 0;
    }}

    li {{
      margin-bottom: 3.5pt;
    }}

    .badge {{
      display: inline-block;
      padding: 2px 7px;
      border-radius: 9999px;
      font-size: 7.5pt;
      font-weight: 700;
    }}

    hr {{
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 16pt 0;
    }}
  </style>
</head>
<body>

<div class="header-box">
  <h1>دليل سيناريو التشغيل والاختبار التكاملي الشامل (SBA Playbook)</h1>
  <p>منظومة تحليل سلوك الطلاب والتنبؤ بالتعثر الأكاديمي باستخدام الذكاء الاصطناعي القابل للتفسير | إصدار الفحص والاعتماد 2026</p>
</div>

{body_html}

<script>
  // Convert pre.mermaid to div.mermaid and run mermaid
  document.addEventListener("DOMContentLoaded", async function() {{
    const mermaidNodes = document.querySelectorAll('pre.mermaid, pre > code.language-mermaid');
    mermaidNodes.forEach((el) => {{
      const pre = el.tagName === 'CODE' ? el.parentElement : el;
      const code = el.innerText || el.textContent;
      const div = document.createElement('div');
      div.className = 'mermaid';
      div.textContent = code;
      pre.parentNode.replaceChild(div, pre);
    }});

    mermaid.initialize({{
      startOnLoad: false,
      theme: 'neutral',
      fontFamily: 'Cairo, -apple-system, sans-serif',
      fontSize: '12px',
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
    "--virtual-time-budget=12000",
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
