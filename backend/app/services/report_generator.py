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
    
    def _get_day_master_element(self, day_master: str) -> str:
        """Get the element name for the Day Master (日主)
        
        Maps: 甲乙=Wood, 丙丁=Fire, 戊己=Earth, 庚辛=Metal, 壬癸=Water
        Returns: 'Water 水' format for use in caption
        """
        element_map = {
            '甲': 'Wood 木', '乙': 'Wood 木',
            '丙': 'Fire 火', '丁': 'Fire 火',
            '戊': 'Earth 土', '己': 'Earth 土',
            '庚': 'Metal 金', '辛': 'Metal 金',
            '壬': 'Water 水', '癸': 'Water 水'
        }
        return element_map.get(day_master, 'Unknown')
    
    def _inject_five_elements_svg(self, html_content: str, day_master: str) -> str:
        """Inject Five Elements SVG diagram into the Introduction section.
        
        CHANGE 4 FIX: The SVG must appear INSIDE the Introduction section,
        after the text 'The Five Elements (五行 Wu Xing)' as shown in image-1.png.
        """
        import re
        
        # Load SVG from file
        svg_path = Path(__file__).parent.parent / "templates" / "five_elements_cycle.svg"
        try:
            svg_content = svg_path.read_text(encoding='utf-8')
        except Exception:
            svg_content = ""
        
        # Get Day Master element for caption
        day_master_element = self._get_day_master_element(day_master)
        
        # Create the Five Elements block to inject
        five_elements_block = f'''
<div class="five-elements-diagram" style="text-align: center; margin: 1.5rem auto; padding: 1rem; max-width: 450px; background: linear-gradient(135deg, #fef9e7 0%, #fff8e1 100%); border-radius: 12px; border: 1px solid #d4a574;">
{svg_content}
<p style="color: #666; font-size: 0.85rem; margin-top: 0.8rem; font-style: italic;">
<strong style="color: #059669;">Green arrows</strong> = Generating Cycle (相生) • 
<strong style="color: #dc2626;">Red dashed</strong> = Controlling Cycle (相克)
</p>
<p style="color: #8b4513; font-size: 0.95rem; margin-top: 0.4rem; font-weight: 600;">
🌊 Your Day Master: <strong>{day_master}</strong> ({day_master_element})
</p>
</div>
'''
        
        # Pattern to find the Wu Xing / Five Elements section and insert SVG after it
        # The AI-generated content has: <h3>Wu Xing - The Five Element Dance</h3>
        # followed by paragraphs about Generating and Controlling cycles
        # We want to insert the SVG AFTER the paragraph containing "Controlling Cycle"
        
        patterns = [
            # Pattern 1: After paragraph containing "Controlling Cycle" WITH inner tags allowed
            r'(<p>.*?Controlling Cycle.*?相剋.*?</p>)',
            # Pattern 2: After paragraph containing "相剋" (Chinese for controlling)
            r'(<p>.*?相剋.*?</p>)',
            # Pattern 3: After paragraph containing both cycle types
            r'(<p>.*?Generating Cycle.*?Controlling Cycle.*?</p>)',
            # Pattern 4: After any paragraph containing "Generating Cycle"
            r'(<p>.*?Generating Cycle.*?</p>)',
            # Pattern 5: After paragraph mentioning Wu Xing
            r'(<p>.*?Wu Xing.*?</p>)',
            # Pattern 6: After h3 containing "Wu Xing" followed by first paragraph
            r'(<h3>.*?Wu Xing.*?</h3>\s*<p>.*?</p>)',
            # Pattern 7: After any mention of Five Elements with closing tag
            r'(<p>.*?Five Elements?.*?</p>)',
            # Pattern 8: After h3 containing "INTRODUCTION" followed by content
            r'(<h2>INTRODUCTION</h2>.*?</p>)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, html_content, re.IGNORECASE | re.DOTALL)
            if match:
                # Insert the diagram after the matched content
                insert_pos = match.end()
                html_content = html_content[:insert_pos] + five_elements_block + html_content[insert_pos:]
                break
        
        return html_content
    
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
        birth_date_raw = bazi_data.get('阳历', 'N/A')
        # CHANGE 2: Remove time from birth_date to avoid repetition
        # e.g., "1993年9月28日 13:55:00" -> "1993年9月28日"
        birth_date_only = birth_date_raw.split(' ')[0] if ' ' in str(birth_date_raw) else birth_date_raw
        birth_year = birth_date_raw.split('-')[0] if '-' in str(birth_date_raw) else birth_date_raw[:4] if len(str(birth_date_raw)) >= 4 else 'N/A'
        
        # CHANGE 4: Extract birth_day, birth_month, and format report_year
        # Chinese date format: "1993年9月28日" -> day=28, month=9
        import re
        birth_day = 'N/A'
        birth_month = 'N/A'
        
        # Try to parse Chinese date format (e.g., "1993年9月28日")
        chinese_match = re.search(r'(\d+)年(\d+)月(\d+)日', str(birth_date_raw))
        if chinese_match:
            birth_month = chinese_match.group(2)  # e.g., "9"
            birth_day = chinese_match.group(3)    # e.g., "28"
        else:
            # Try ISO format (e.g., "1993-09-28")
            iso_match = re.search(r'(\d{4})-(\d{2})-(\d{2})', str(birth_date_raw))
            if iso_match:
                birth_month = str(int(iso_match.group(2)))  # Remove leading zero
                birth_day = str(int(iso_match.group(3)))    # Remove leading zero
        
        # CHANGE 4: Format report_year as "Mmm-YYYY" (e.g., "Feb-2026")
        report_year = datetime.now().strftime("%b-%Y")  # e.g., "Feb-2026"
        
        return template.render(
            # Header info
            name=name,
            birth_date=birth_date_only,  # CHANGE 2: Date only, no time
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
            # CHANGE 4 FIX: Inject Five Elements SVG into content BEFORE template rendering
            report_content=self._inject_five_elements_svg(html_content, bazi_data.get('日主', '')),
            current_year=datetime.now().year,
            
            # CHANGE 4: New header format variables
            birth_day=birth_day,      # Just the day number (e.g., "28")
            birth_month=birth_month,  # Just the month number (e.g., "9")
            report_year=report_year,  # Formatted as "Feb-2026"
            
            # Dynamic Five Elements caption
            day_master_element=self._get_day_master_element(bazi_data.get('日主', ''))
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
            
            /* BaZi Table for PDF */
            .bazi-table {
                width: 100%;
                max-width: 500px;
                margin: 0 auto 15px;
                border-collapse: collapse;
            }
            
            .bazi-table th,
            .bazi-table td {
                padding: 8px 5px;
                text-align: center;
                border: 1px solid #e2e8f0;
            }
            
            .header-row th {
                background: #0f172a;
                color: white;
                font-size: 9pt;
                font-weight: 600;
            }
            
            .header-detail {
                font-size: 7pt;
                font-weight: 400;
                opacity: 0.8;
            }
            
            .label-cell {
                background: #f8fafc;
                font-size: 8pt;
                font-weight: 700;
                width: 50px;
            }
            
            .label-chinese {
                font-size: 6pt;
                color: #475569;
            }
            
            .element-cell {
                background: white;
            }
            
            .chinese-char {
                font-size: 14pt;
                font-weight: bold;
            }
            
            .romanized {
                font-size: 7pt;
                color: #475569;
            }
            
            /* Element cell backgrounds for PDF */
            .element-cell.wood { color: #22c55e; background: #f0fdf4; }
            .element-cell.fire { color: #ef4444; background: #fef2f2; }
            .element-cell.earth { color: #d97706; background: #fffbeb; }
            .element-cell.metal { color: #6b7280; background: #f9fafb; }
            .element-cell.water { color: #3b82f6; background: #eff6ff; }
            
            /* Element Colors - CORRECT as per Manager */
            .wood { color: #22c55e; }  /* Green */
            .fire { color: #ef4444; }
            .earth { color: #d97706; }  /* Orangey-Yellow */
            .metal { color: #6b7280; }  /* Grey */
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
