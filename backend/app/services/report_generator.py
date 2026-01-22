"""
Report Generator Service - File-Based HTML/PDF Generation
===========================================================

🎓 ARCHITECTURE:
---------------
1. Generate HTML from Jinja2 template
2. Save HTML to local file
3. Convert HTML to PDF with WeasyPrint
4. Save PDF to local file
5. Return file paths

File Structure:
    backend/reports/{uuid}/
        ├── report.html
        ├── report.pdf
        └── data.json (optional)
"""

import os
import uuid
import json
from pathlib import Path
from datetime import datetime
from jinja2 import Environment, FileSystemLoader
import markdown

# WeasyPrint for PDF generation
from weasyprint import HTML, CSS

from app.config import settings


class ReportGeneratorError(Exception):
    """Custom exception for report generation errors"""
    pass


class ReportGenerator:
    """
    Generates and saves HTML/PDF reports locally
    
    Usage:
        generator = ReportGenerator()
        result = generator.generate(bazi_data, markdown_content)
        # result = {
        #     "report_id": "abc-123",
        #     "html_path": "/reports/abc-123/report.html",
        #     "pdf_path": "/reports/abc-123/report.pdf"
        # }
    """
    
    def __init__(self, base_dir: str = None):
        """
        Initialize report generator
        
        Args:
            base_dir: Base directory for storing reports (default: backend/reports)
        """
        # Set reports directory
        self.base_dir = Path(base_dir) if base_dir else Path(__file__).parent.parent.parent / "reports"
        
        # Ensure reports directory exists
        self.base_dir.mkdir(parents=True, exist_ok=True)
        
        # Setup Jinja2 template environment
        template_dir = Path(__file__).parent.parent / "templates"
        self.jinja_env = Environment(loader=FileSystemLoader(str(template_dir)))
    
    def _generate_report_id(self) -> str:
        """Generate unique report ID using UUID"""
        return str(uuid.uuid4())[:8]  # Short UUID for cleaner URLs
    
    def _create_report_directory(self, report_id: str) -> Path:
        """Create directory for report files"""
        report_dir = self.base_dir / report_id
        report_dir.mkdir(parents=True, exist_ok=True)
        return report_dir
    
    def _convert_markdown_to_html(self, markdown_content: str) -> str:
        """Convert Markdown to HTML"""
        return markdown.markdown(
            markdown_content,
            extensions=['extra', 'nl2br', 'sane_lists', 'tables']
        )
    
    def _render_html_template(
        self, 
        bazi_data: dict, 
        html_content: str
    ) -> str:
        """Render the Jinja2 HTML template with data"""
        template = self.jinja_env.get_template("report.html")
        
        return template.render(
            bazi_chars=bazi_data.get('八字', 'N/A'),
            day_master=bazi_data.get('日主', 'N/A'),
            zodiac=bazi_data.get('生肖', 'N/A'),
            birth_date=bazi_data.get('阳历', 'N/A'),
            report_content=html_content,
            current_year=datetime.now().year
        )
    
    def _save_html(self, report_dir: Path, html_content: str) -> Path:
        """Save HTML to file"""
        html_path = report_dir / "report.html"
        html_path.write_text(html_content, encoding='utf-8')
        return html_path
    
    def _save_pdf(self, report_dir: Path, html_content: str) -> Path:
        """Convert HTML to PDF and save"""
        pdf_path = report_dir / "report.pdf"
        
        # Comprehensive PDF CSS - Fixes box collapse and layout issues
        pdf_css = CSS(string='''
            /* Page Setup */
            @page {
                size: A4;
                margin: 2cm 1.5cm;
            }
            
            /* Reset and Base */
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: "Segoe UI", "Microsoft YaHei", Arial, sans-serif;
                font-size: 10pt;
                line-height: 1.7;
                color: #333;
                background: white !important;
            }
            
            /* Header Styling */
            .report-header {
                text-align: center;
                padding: 20px 0 30px;
                margin-bottom: 20px;
                border-bottom: 2px solid #d4a537;
                background: #faf8f3 !important;
            }
            
            .report-title {
                font-size: 22pt;
                color: #8B4513;
                margin-bottom: 5px;
            }
            
            .report-subtitle {
                font-size: 11pt;
                color: #666;
                font-style: italic;
            }
            
            /* BaZi Card - Fixed box layout */
            .bazi-card {
                background: #f5f0e6 !important;
                border: 2px solid #d4a537;
                border-radius: 8px;
                padding: 15px 20px;
                margin: 20px auto 30px;
                max-width: 400px;
                text-align: center;
                page-break-inside: avoid;
            }
            
            .bazi-chars {
                font-size: 20pt;
                color: #8B4513;
                letter-spacing: 0.2em;
                margin-bottom: 10px;
                font-weight: bold;
            }
            
            .bazi-meta {
                font-size: 9pt;
                color: #555;
            }
            
            .bazi-meta strong {
                color: #8B4513;
            }
            
            /* Main Content */
            .report-container {
                padding: 0 10px;
            }
            
            .report-content {
                background: white !important;
                padding: 10px 0;
            }
            
            /* Headings - Prevent orphans */
            h1 {
                font-size: 16pt;
                color: #8B4513;
                margin: 25px 0 15px;
                padding-bottom: 8px;
                border-bottom: 2px solid #d4a537;
                page-break-after: avoid;
            }
            
            h2 {
                font-size: 13pt;
                color: #6B4423;
                margin: 20px 0 12px;
                padding-left: 10px;
                border-left: 3px solid #d4a537;
                page-break-after: avoid;
            }
            
            h3 {
                font-size: 11pt;
                color: #5D3A1A;
                margin: 15px 0 10px;
                page-break-after: avoid;
            }
            
            h4 {
                font-size: 10pt;
                color: #444;
                margin: 12px 0 8px;
                page-break-after: avoid;
            }
            
            /* Paragraphs */
            p {
                margin: 10px 0;
                text-align: justify;
                page-break-inside: avoid;
            }
            
            /* Text Emphasis */
            strong { 
                color: #8B4513; 
            }
            
            em { 
                color: #6B4423; 
                font-style: italic;
            }
            
            /* Lists */
            ul, ol {
                margin: 10px 0 10px 25px;
                padding: 0;
            }
            
            li {
                margin: 5px 0;
                page-break-inside: avoid;
            }
            
            /* Horizontal Rules */
            hr {
                border: none;
                border-top: 1px solid #d4a537;
                margin: 25px 0;
            }
            
            /* Blockquotes */
            blockquote {
                background: #f9f6f0;
                border-left: 3px solid #8B4513;
                padding: 10px 15px;
                margin: 15px 0;
                font-style: italic;
                page-break-inside: avoid;
            }
            
            /* Code */
            code {
                background: #f5f0e6;
                padding: 2px 5px;
                font-family: monospace;
                font-size: 9pt;
            }
            
            /* Footer */
            .report-footer {
                text-align: center;
                font-size: 8pt;
                color: #888;
                margin-top: 30px;
                padding-top: 15px;
                border-top: 1px solid #ddd;
            }
            
            /* Prevent page breaks inside important elements */
            .bazi-card,
            blockquote,
            ul, ol,
            table {
                page-break-inside: avoid;
            }
            
            /* Keep headings with following content */
            h1, h2, h3, h4 {
                page-break-after: avoid;
            }
            
            /* Allow page breaks before major sections */
            h1 {
                page-break-before: auto;
            }
        ''')
        
        # Generate PDF
        HTML(string=html_content).write_pdf(pdf_path, stylesheets=[pdf_css])
        
        return pdf_path
    
    def _save_data(self, report_dir: Path, bazi_data: dict) -> Path:
        """Save raw BaZi data as JSON (for debugging/future use)"""
        data_path = report_dir / "data.json"
        data_path.write_text(
            json.dumps(bazi_data, ensure_ascii=False, indent=2),
            encoding='utf-8'
        )
        return data_path
    
    def generate(
        self, 
        bazi_data: dict, 
        markdown_content: str
    ) -> dict:
        """
        Generate complete report (HTML + PDF)
        
        Args:
            bazi_data: Raw BaZi calculation data from MCP server
            markdown_content: Report text from Claude (Markdown format)
            
        Returns:
            dict with report_id and file paths
        """
        try:
            # Generate unique ID
            report_id = self._generate_report_id()
            
            # Create report directory
            report_dir = self._create_report_directory(report_id)
            
            # Convert Markdown → HTML
            content_html = self._convert_markdown_to_html(markdown_content)
            
            # Render full HTML template
            full_html = self._render_html_template(bazi_data, content_html)
            
            # Save HTML file
            html_path = self._save_html(report_dir, full_html)
            
            # Save PDF file
            pdf_path = self._save_pdf(report_dir, full_html)
            
            # Save raw data (optional)
            self._save_data(report_dir, bazi_data)
            
            return {
                "report_id": report_id,
                "html_path": f"/reports/{report_id}/report.html",
                "pdf_path": f"/reports/{report_id}/report.pdf",
                "html_file": str(html_path),
                "pdf_file": str(pdf_path)
            }
            
        except Exception as e:
            raise ReportGeneratorError(f"Failed to generate report: {str(e)}")


# Singleton instance
report_generator = ReportGenerator()
