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
    
    def _get_element_class(self, element: str) -> str:
        """Map Chinese element to CSS class"""
        element_map = {
            '木': 'wood',
            '火': 'fire',
            '土': 'earth',
            '金': 'metal',
            '水': 'water',
        }
        return element_map.get(element, 'earth')
    
    def _get_stem_name(self, stem: str) -> str:
        """Get romanized name for Heavenly Stem"""
        stem_names = {
            '甲': 'Jia', '乙': 'Yi', '丙': 'Bing', '丁': 'Ding', '戊': 'Wu',
            '己': 'Ji', '庚': 'Geng', '辛': 'Xin', '壬': 'Ren', '癸': 'Gui'
        }
        return stem_names.get(stem, stem)
    
    def _get_branch_name(self, branch: str) -> str:
        """Get romanized name + zodiac animal for Earthly Branch"""
        branch_names = {
            '子': 'Rat', '丑': 'Ox', '寅': 'Tiger', 
            '卯': 'Rabbit', '辰': 'Dragon', '巳': 'Snake',
            '午': 'Horse', '未': 'Goat', '申': 'Monkey',
            '酉': 'Rooster', '戌': 'Dog', '亥': 'Pig'
        }
        return branch_names.get(branch, branch)
    
    def _extract_pillar_data(self, pillar: dict) -> dict:
        """Extract stem and branch data from a pillar"""
        stem_data = pillar.get('天干', {})
        branch_data = pillar.get('地支', {})
        
        stem = stem_data.get('天干', '?')
        branch = branch_data.get('地支', '?')
        
        return {
            'stem': stem,
            'stem_name': self._get_stem_name(stem),
            'stem_element': self._get_element_class(stem_data.get('五行', '土')),
            'branch': branch,
            'branch_name': self._get_branch_name(branch),
            'branch_element': self._get_element_class(branch_data.get('五行', '土')),
        }
    
    def _convert_markdown_to_html(self, markdown_content: str) -> str:
        """Convert Markdown to HTML"""
        return markdown.markdown(
            markdown_content,
            extensions=['extra', 'nl2br', 'sane_lists', 'tables']
        )
    
    def _render_html_template(
        self, 
        bazi_data: dict, 
        html_content: str,
        request_data: dict = None
    ) -> str:
        """Render the Jinja2 HTML template with all pillar data"""
        template = self.jinja_env.get_template("report.html")
        
        # Extract pillar data
        year_pillar = self._extract_pillar_data(bazi_data.get('年柱', {}))
        month_pillar = self._extract_pillar_data(bazi_data.get('月柱', {}))
        day_pillar = self._extract_pillar_data(bazi_data.get('日柱', {}))
        hour_pillar = self._extract_pillar_data(bazi_data.get('时柱', {}))
        
        # Extract name from location or use default
        location = request_data.get('location', 'Unknown') if request_data else 'Unknown'
        name = request_data.get('name', location.split(',')[0].strip()) if request_data else 'Your'
        
        # Extract birth year from birth_date
        birth_date = bazi_data.get('阳历', 'N/A')
        birth_year = birth_date.split('-')[0] if '-' in str(birth_date) else birth_date[:4] if len(str(birth_date)) >= 4 else 'N/A'
        
        return template.render(
            # Header info
            name=name,
            birth_date=bazi_data.get('阳历', 'N/A'),
            birth_time=request_data.get('birth_time', 'N/A') if request_data else 'N/A',
            location=location,
            gender=request_data.get('gender', 'Male').capitalize() if request_data else 'N/A',
            
            # Year Pillar
            year_stem=year_pillar['stem'],
            year_stem_name=year_pillar['stem_name'],
            year_stem_element=year_pillar['stem_element'],
            year_branch=year_pillar['branch'],
            year_branch_name=year_pillar['branch_name'],
            year_branch_element=year_pillar['branch_element'],
            birth_year=birth_year,
            
            # Month Pillar
            month_stem=month_pillar['stem'],
            month_stem_name=month_pillar['stem_name'],
            month_stem_element=month_pillar['stem_element'],
            month_branch=month_pillar['branch'],
            month_branch_name=month_pillar['branch_name'],
            month_branch_element=month_pillar['branch_element'],
            
            # Day Pillar
            day_stem=day_pillar['stem'],
            day_stem_name=day_pillar['stem_name'],
            day_stem_element=day_pillar['stem_element'],
            day_branch=day_pillar['branch'],
            day_branch_name=day_pillar['branch_name'],
            day_branch_element=day_pillar['branch_element'],
            
            # Hour Pillar
            hour_stem=hour_pillar['stem'],
            hour_stem_name=hour_pillar['stem_name'],
            hour_stem_element=hour_pillar['stem_element'],
            hour_branch=hour_pillar['branch'],
            hour_branch_name=hour_pillar['branch_name'],
            hour_branch_element=hour_pillar['branch_element'],
            
            # Summary data
            bazi_chars=bazi_data.get('八字', 'N/A'),
            day_master=bazi_data.get('日主', 'N/A'),
            zodiac=bazi_data.get('生肖', 'N/A'),
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
        
        # Comprehensive PDF CSS - Supports Four Pillars with Elemental Colors
        pdf_css = CSS(string='''
            /* Page Setup */
            @page {
                size: A4;
                margin: 1.5cm 1.2cm;
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
                color: #1e293b;
                background: white !important;
            }
            
            /* Header Styling */
            .report-header {
                text-align: center;
                padding: 25px 20px;
                margin-bottom: 20px;
                border-bottom: 3px solid #b48e3e;
                background: #0f172a !important;
                color: white;
            }
            
            .header-logo {
                font-size: 24pt;
                display: block;
                margin-bottom: 5px;
            }
            
            .report-title {
                font-size: 18pt;
                color: #b48e3e;
                margin-bottom: 5px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .report-subtitle {
                font-size: 10pt;
                color: rgba(255,255,255,0.7);
                font-style: italic;
            }
            
            .report-meta {
                font-size: 9pt;
                color: rgba(255,255,255,0.6);
                margin-top: 10px;
            }
            
            /* Four Pillars Dashboard */
            .bazi-dashboard {
                background: #f8fafc !important;
                border: 1px solid #b48e3e;
                padding: 15px;
                margin: 15px 10px 20px;
                page-break-inside: avoid;
            }
            
            .pillars-title {
                text-align: center;
                font-size: 12pt;
                color: #0f172a;
                margin-bottom: 15px;
            }
            
            .pillars-grid {
                display: flex;
                justify-content: center;
                gap: 10px;
                margin-bottom: 15px;
            }
            
            .pillar {
                text-align: center;
                padding: 10px 15px;
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 5px;
                min-width: 80px;
            }
            
            .pillar-label {
                font-size: 8pt;
                color: #475569;
                text-transform: uppercase;
                margin-bottom: 5px;
            }
            
            .stem {
                font-size: 16pt;
                font-weight: bold;
                display: block;
            }
            
            .stem-name, .branch-name {
                font-size: 7pt;
                color: #475569;
            }
            
            .branch {
                font-size: 14pt;
                font-weight: 600;
                display: block;
            }
            
            /* Element Colors */
            .wood { color: #22c55e; }
            .fire { color: #ef4444; }
            .earth { color: #a16207; }
            .metal { color: #f59e0b; }
            .water { color: #3b82f6; }
            
            .meta-grid {
                display: flex;
                justify-content: space-around;
                border-top: 1px solid #e2e8f0;
                padding-top: 15px;
            }
            
            .meta-item {
                text-align: center;
            }
            
            .meta-label {
                font-size: 7pt;
                color: #475569;
                text-transform: uppercase;
                display: block;
            }
            
            .meta-value {
                font-size: 11pt;
                color: #b48e3e;
                font-weight: bold;
            }
            
            /* Element Cycle Section */
            .element-cycle {
                text-align: center;
                margin: 20px auto;
                padding: 15px;
                background: #f8fafc !important;
                border: 1px solid #e2e8f0;
                page-break-inside: avoid;
            }
            
            .element-cycle-title {
                font-size: 11pt;
                color: #0f172a;
                margin-bottom: 10px;
            }
            
            .element-cycle svg {
                max-width: 300px;
                height: auto;
            }
            
            /* Main Content */
            .content-body {
                padding: 10px 15px;
            }
            
            /* Headings */
            h1 {
                font-size: 14pt;
                color: #0f172a;
                margin: 25px 0 12px;
                padding-bottom: 8px;
                border-bottom: 2px solid #b48e3e;
                page-break-after: avoid;
            }
            
            h2 {
                font-size: 12pt;
                color: #b48e3e;
                margin: 18px 0 10px;
                page-break-after: avoid;
            }
            
            h3 {
                font-size: 10pt;
                color: #0f172a;
                margin: 14px 0 8px;
                font-weight: bold;
                page-break-after: avoid;
            }
            
            /* Paragraphs */
            p {
                margin: 8px 0;
                text-align: justify;
            }
            
            /* Text Emphasis */
            strong { color: #0f172a; }
            em { color: #b48e3e; font-style: italic; }
            
            /* Lists */
            ul, ol {
                margin: 8px 0 8px 20px;
                padding: 0;
            }
            
            li {
                margin: 4px 0;
                page-break-inside: avoid;
            }
            
            /* Horizontal Rules */
            hr {
                border: none;
                border-top: 1px solid #e2e8f0;
                margin: 20px 0;
            }
            
            /* Blockquotes */
            blockquote {
                background: #f8fafc;
                border-left: 3px solid #b48e3e;
                padding: 10px 15px;
                margin: 12px 0;
                font-style: italic;
                page-break-inside: avoid;
            }
            
            /* Tables */
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 15px 0;
                font-size: 9pt;
            }
            
            thead {
                background: #0f172a !important;
                color: white;
            }
            
            th {
                padding: 8px 10px;
                text-align: left;
                font-weight: 600;
                font-size: 8pt;
            }
            
            td {
                padding: 6px 10px;
                border-bottom: 1px solid #e2e8f0;
            }
            
            tbody tr:nth-child(even) {
                background: #f8fafc;
            }
            
            /* Footer */
            .report-footer {
                text-align: center;
                font-size: 8pt;
                color: #475569;
                margin-top: 25px;
                padding: 15px;
                border-top: 1px solid #e2e8f0;
                background: #f8fafc !important;
            }
            
            /* Page break controls */
            .bazi-dashboard, .element-cycle, blockquote {
                page-break-inside: avoid;
            }
            
            /* Tables can break across pages but rows shouldn't split */
            table {
                page-break-inside: auto;
            }
            
            thead {
                display: table-header-group;
            }
            
            tr {
                page-break-inside: avoid;
                page-break-after: auto;
            }
            
            h1, h2, h3 {
                page-break-after: avoid;
            }
            
            /* Keep h2 with following content together */
            h2 {
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
        markdown_content: str,
        request_data: dict = None
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
            
            # Render full HTML template (pass request_data for name, gender, etc.)
            full_html = self._render_html_template(bazi_data, content_html, request_data)
            
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
