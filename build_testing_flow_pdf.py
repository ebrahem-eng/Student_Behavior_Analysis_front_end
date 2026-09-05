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

# 2. Build full HTML document with styling, KaTeX/MathJax, and Mermaid
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
      margin: 18mm 14mm 18mm 14mm;
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
    }}

    h2 {{
      font-size: 15pt;
      color: #1e40af;
      border-bottom: 1.5px solid #cbd5e1;
      padding-bottom: 5px;
      margin-top: 20pt;
      margin-bottom: 10pt;
    }}

    h3 {{
      font-size: 12.5pt;
      color: #334155;
      margin-top: 16pt;
      margin-bottom: 6pt;
    }}

    p {{
      margin: 0 0 10pt 0;
      text-align: justify;
    }}

    /* Cover / Header section */
    .header-box {{
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      color: white;
      padding: 24px 28px;
      border-radius: 12px;
      margin-bottom: 24pt;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }}

    .header-box h1 {{
      color: #ffffff !important;
      border-bottom: none;
      margin: 0 0 8px 0;
      padding: 0;
      font-size: 22pt;
    }}

    .header-box p {{
      color: #e2e8f0;
      font-size: 11pt;
      margin: 0;
    }}

    /* Tables */
    table {{
      width: 100%;
      border-collapse: collapse;
      margin: 14pt 0;
      font-size: 9.5pt;
      page-break-inside: avoid;
      break-inside: avoid;
    }}

    th, td {{
      padding: 7pt 9pt;
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
      margin: 14pt 0;
      padding: 10pt 14pt;
      background-color: #eff6ff;
      border-right: 4px solid #3b82f6;
      border-left: none;
      border-radius: 6px;
      color: #1e3a8a;
    }}

    blockquote p {{
      margin: 0;
    }}

    /* Code blocks */
    code {{
      font-family: 'Fira Code', monospace;
      background-color: #f1f5f9;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 9pt;
      color: #0f172a;
      direction: ltr;
      display: inline-block;
    }}

    pre {{
      background-color: #0f172a;
      color: #f8fafc;
      padding: 12pt;
      border-radius: 8px;
      font-family: 'Fira Code', monospace;
      font-size: 8.5pt;
      overflow-x: auto;
      direction: ltr;
      text-align: left;
      margin: 12pt 0;
      line-height: 1.5;
    }}

    pre code {{
      background: none;
      color: inherit;
      padding: 0;
      display: block;
    }}

    /* Mermaid diagrams container */
    .mermaid {{
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14pt;
      margin: 14pt 0;
      text-align: center;
      direction: ltr;
    }}

    /* Lists */
    ul, ol {{
      margin: 0 0 12pt 0;
      padding-right: 22px;
      padding-left: 0;
    }}

    li {{
      margin-bottom: 4pt;
    }}

    .badge {{
      display: inline-block;
      padding: 2px 8px;
      border-radius: 9999px;
      font-size: 8pt;
      font-weight: 700;
    }}

    .badge-high {{ background-color: #fee2e2; color: #b91c1c; border: 1px solid #f87171; }}
    .badge-med {{ background-color: #fef3c7; color: #b45309; border: 1px solid #fcd34d; }}
    .badge-low {{ background-color: #dcfce7; color: #15803d; border: 1px solid #86efac; }}

    hr {{
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 20pt 0;
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
  // Initialize Mermaid for flowcharts
  mermaid.initialize({{
    startOnLoad: false,
    theme: 'neutral',
    flowchart: {{
      curve: 'basis',
      useMaxWidth: true,
      htmlLabels: true
    }}
  }});

  window.addEventListener('DOMContentLoaded', async () => {{
    // Replace markdown mermaid pre blocks with actual mermaid divs
    document.querySelectorAll('pre.mermaid, pre > code.language-mermaid').forEach(el => {{
      const pre = el.tagName === 'CODE' ? el.parentElement : el;
      const div = document.createElement('div');
      div.className = 'mermaid';
      div.textContent = el.textContent;
      pre.parentElement.replaceChild(div, pre);
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
