import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        
        if self._pageNumber > 1:
            self.drawString(54, 750, "RoadSense AI — Research, System Architecture & Deployment Publication")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(54, 742, 558, 742)
            
            page_text = f"Page {self._pageNumber} of {page_count}"
            self.drawRightString(558, 36, page_text)
            self.drawString(54, 36, "Confidential — Municipal Infrastructure & Deep Learning Operations")
            self.line(54, 48, 558, 48)
            
        self.restoreState()

def build_pdf_styles():
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0f172a'),
        alignment=1,
        spaceAfter=10
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor('#2563eb'),
        alignment=1,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#1e3a8a'),
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155'),
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=3
    )

    code_style = ParagraphStyle(
        'CodeBlock',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor('#0f172a'),
        backColor=colors.HexColor('#f8fafc'),
        borderColor=colors.HexColor('#cbd5e1'),
        borderWidth=0.5,
        borderPadding=5,
        spaceBefore=4,
        spaceAfter=6
    )

    return {
        'title': title_style,
        'subtitle': subtitle_style,
        'h1': h1_style,
        'h2': h2_style,
        'body': body_style,
        'bullet': bullet_style,
        'code': code_style
    }

def create_research_deployment_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    
    st = build_pdf_styles()
    story = []

    story.append(Paragraph("RoadSense AI: Intelligent Road Damage Detection, Multi-Factor Spatial Prioritization & Cloud Deployment Analysis", st['title']))
    story.append(Paragraph("<b>Comprehensive Academic Research Paper & Full-Stack Cloud Deployment Specification</b><br/>Authors: Municipal Infrastructure & Deep Learning Research Group", st['subtitle']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#1e3a8a"), spaceAfter=12))

    story.append(Paragraph("Abstract", st['h1']))
    abstract_text = (
        "<b>Abstract</b>—Municipal road network degradation costs millions in vehicular damage and poses human safety hazards. "
        "This paper details <i>RoadSense AI</i>, a production platform integrating fine-tuned computer vision object detection (YOLOv8) with a spatial Haversine duplicate clustering engine, "
        "a multi-factor priority scoring algorithm, and a cloud-native deployment pipeline on Render. "
        "The system classifies 5 road damage types (Pothole, Longitudinal Crack, Transverse Crack, Alligator Crack, Road Patch), calculates bounding box coordinates, "
        "and synthesizes environmental, spatial, and pedestrian metadata into a deterministic priority score P<sub>score</sub>. "
        "Furthermore, this document analyzes the cloud deployment resolution, addressing Linux cross-platform node module resolution, dependency scoping, and production build pipelines."
    )
    story.append(Paragraph(abstract_text, st['body']))
    story.append(Spacer(1, 6))

    story.append(Paragraph("1. System Architecture & Component Interactions", st['h1']))
    arch_desc = (
        "RoadSense AI operates as a decoupled microservice architecture: a React SPA (Vite) frontend communicates with a Node.js Express REST API gateway, "
        "which routes computer vision workloads to an asynchronous Python Flask AI microservice. Persistent data and GeoJSON 2dsphere spatial indices are managed in MongoDB Atlas."
    )
    story.append(Paragraph(arch_desc, st['body']))

    deploy_summary = [
        ["Deployment Aspect", "Production Specification", "Live Cloud Instance Details"],
        ["GitHub Repository", "https://github.com/Karthik-543/RoadRepair.git", "Branch: main (Autocommit ae37fd1, 5cbd943, 335dd22)"],
        ["Live Render URL", "https://roadrepair.onrender.com", "Free Web Service Instance (Node 24 Runtime)"],
        ["MongoDB Cloud Atlas", "cluster0.5gufyfa.mongodb.net / roadsense_ai", "2dsphere GeoJSON Spatial Indexing & Pre-seeded Data"],
        ["AI Service Runtime", "Python Flask + OpenCV + PyTorch YOLOv8", "Port 5001 Microservice Engine"]
    ]
    t_deploy = Table(deploy_summary, colWidths=[120, 190, 194])
    t_deploy.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1e3a8a')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 8.5),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#f8fafc')),
        ('FONTSIZE', (0,1), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_deploy)
    story.append(Spacer(1, 8))

    story.append(Paragraph("2. Computer Vision Engine & Defect Classification", st['h1']))
    cv_desc = (
        "The computer vision subsystem employs YOLOv8 deep convolutional neural networks to perform single-pass bounding box regression and class probability estimation. "
        "Defects are categorized into five distinct pavement distress classes:"
    )
    story.append(Paragraph(cv_desc, st['body']))

    classes_data = [
        ["Damage Class", "Structural Cause & Characteristics", "Base Severity Score (S_damage)"],
        ["Pothole", "Bowl-shaped cavity resulting from sub-base failure & water freeze-thaw cycles", "50 / 100"],
        ["Alligator Crack", "Interlocking fatigue cracking pattern caused by repeated heavy wheel loads", "40 / 100"],
        ["Longitudinal Crack", "Linear cracking parallel to pavement centerline from longitudinal joint failure", "30 / 100"],
        ["Transverse Crack", "Cracks perpendicular to pavement centerline caused by thermal shrinkage", "20 / 100"],
        ["Road Patch", "Re-surfaced asphalt fill indicating localized historic repair work", "10 / 100"]
    ]
    t_classes = Table(classes_data, colWidths=[110, 280, 114])
    t_classes.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0f172a')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 8.5),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('FONTSIZE', (0,1), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_classes)
    story.append(Spacer(1, 8))

    story.append(Paragraph("3. Multi-Factor Priority Scoring Formulation", st['h1']))
    formula_text = (
        "The priority engine computes a deterministic composite score P<sub>score</sub> combining 8 environmental, structural, and spatial parameters:"
    )
    story.append(Paragraph(formula_text, st['body']))

    formula_code = (
        "P<sub>score</sub> = S<sub>damage</sub> + (15 &times; C<sub>AI</sub>) + min(30, 10 &times; N<sub>dup</sub>) + T<sub>density</sub> + H<sub>hospital</sub> + S<sub>school</sub> + R<sub>category</sub> + A<sub>age</sub>"
    )
    story.append(Paragraph(formula_code, st['code']))

    params_list = [
        "&bull; <b>S<sub>damage</sub></b>: Base defect severity rating (Pothole=50, Alligator=40, Longitudinal=30, Transverse=20, Patch=10).",
        "&bull; <b>C<sub>AI</sub></b>: AI Detection Confidence (0.0 to 1.0), contributing up to 15 points.",
        "&bull; <b>N<sub>dup</sub></b>: Duplicate reports logged within 50 meters, adding +10 points per report (max +30 points).",
        "&bull; <b>T<sub>density</sub></b>: Traffic volume impact (High=20, Medium=10, Low=5).",
        "&bull; <b>H<sub>hospital</sub></b>: Emergency corridor bonus (+15 points if &lt;500m from hospital).",
        "&bull; <b>S<sub>school</sub></b>: Pedestrian zone bonus (+15 points if &lt;200m from school).",
        "&bull; <b>R<sub>category</sub></b>: Arterial hierarchy (Highway=20, Arterial=15, Local Street=5).",
        "&bull; <b>A<sub>age</sub></b>: Unaddressed report dormancy (+2 points per day, max +20)."
    ]
    for p in params_list:
        story.append(Paragraph(p, st['bullet']))

    story.append(Spacer(1, 6))

    story.append(Paragraph("4. Haversine Spatial Duplicate Clustering", st['h1']))
    haversine_text = (
        "To prevent duplicate citizen submissions from cluttering municipal dispatch queues, the backend executes the Haversine formula on spherical coordinates:<br/>"
        "<code>a = sin²(&Delta;&phi;/2) + cos(&phi;₁) &middot; cos(&phi;₂) &middot; sin²(&Delta;&lambda;/2)</code><br/>"
        "<code>c = 2 &middot; atan2(&radic;a, &radic;(1&minus;a)) &nbsp;&nbsp;&rArr;&nbsp;&nbsp; d = R &middot; c &nbsp;&nbsp;(R = 6,371,000 m)</code><br/>"
        "If distance d &le; 50 meters from an existing active incident, the submission is linked to the parent report, setting <code>isDuplicate: true</code> and boosting parent priority."
    )
    story.append(Paragraph(haversine_text, st['body']))

    story.append(Paragraph("5. Cloud Deployment Troubleshooting & Build Optimization", st['h1']))
    trouble_text = (
        "During deployment on Render (Linux environment), two critical build resolution errors were identified and engineered:<br/>"
        "1. <b>Script Execution Syntax Error</b>: In root <code>package.json</code>, running <code>npm --prefix frontend build</code> failed with <i>Unknown command 'build'</i>. Fix: Updated script to <code>npm --prefix frontend run build</code>.<br/>"
        "2. <b>Module Resolution Error (NODE_ENV=production)</b>: Running <code>vite build</code> produced <i>sh: 1: vite: not found</i> because Vite was scoped under <code>devDependencies</code>. Fix: Shifted Vite and build tools into main <code>dependencies</code> in <code>frontend/package.json</code>, enabling flawless Linux compilation."
    )
    story.append(Paragraph(trouble_text, st['body']))

    doc.build(story, canvasmaker=NumberedCanvas)

def create_devops_guide_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    
    st = build_pdf_styles()
    story = []

    story.append(Paragraph("RoadSense AI: Full-Stack System Architecture, Predefined Authentication & Cloud DevOps Guide", st['title']))
    story.append(Paragraph("<b>Complete Engineering Reference, Database Schemas & Deployment Manual</b><br/>Software Engineering & Infrastructure Operations Division", st['subtitle']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#2563eb"), spaceAfter=12))

    story.append(Paragraph("1. Technology Stack & Component Specifications", st['h1']))
    
    tech_table = [
        ["Component", "Technology", "Role & Engineering Function"],
        ["Client Interface", "React (Vite) + Tailwind CSS", "Single Page Application rendering interactive Leaflet maps, dynamic priority badges, and Recharts analytics dashboards."],
        ["API Gateway", "Express.js + Node.js", "Handles HTTP endpoints, JWT auth validation, Multer file streaming, priority calculations, and static asset serving."],
        ["Database Layer", "MongoDB Atlas + Mongoose", "NoSQL cloud persistence storing GeoJSON 2dsphere points, report metadata, repair logs, and officer codes."],
        ["AI Microservice", "Python Flask + YOLOv8 + OpenCV", "Microservice processing uploaded images, localized bounding boxes, confidence scoring, and visual annotations."],
        ["Auth Security", "JWT + bcryptjs + Officer Codes", "Stateful JWT auth paired with Predefined Officer Security ID database validation for municipal admin access."]
    ]
    t_tech = Table(tech_table, colWidths=[100, 130, 274])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1e3a8a')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 8.5),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#f8fafc')),
        ('FONTSIZE', (0,1), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_tech)
    story.append(Spacer(1, 10))

    story.append(Paragraph("2. Predefined Municipal Officer Security ID Authentication System", st['h1']))
    auth_text = (
        "To prevent unauthorized admin access, municipal officer registrations are validated against the pre-seeded <code>officeraccesscodes</code> collection in MongoDB Atlas. "
        "Attempting to register an admin account with an invalid or already used ID triggers an authentication rejection."
    )
    story.append(Paragraph(auth_text, st['body']))

    officer_table = [
        ["Predefined Security ID", "Department Allocation", "Authorization Level & Status"],
        ["MUN-OFFICER-8842", "Public Works Engineering", "Municipal Officer Admin Access (Active)"],
        ["MUN-OFFICER-9913", "Highway & Pavement Maintenance", "Municipal Officer Admin Access (Active)"],
        ["MUN-OFFICER-1045", "Infrastructure Risk Assessment", "Municipal Officer Admin Access (Active)"],
        ["CITY-ENG-5501", "Rapid Response Inspection Unit", "Municipal Officer Admin Access (Active)"],
        ["PWD-ADMIN-2026", "Chief Municipal Operations", "Chief Municipal Admin Access (Assigned)"]
    ]
    t_officer = Table(officer_table, colWidths=[120, 200, 184])
    t_officer.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0f172a')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 8.5),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('FONTSIZE', (0,1), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_officer)
    story.append(Spacer(1, 10))

    story.append(Paragraph("3. Production Deployment Manual & Render Setup", st['h1']))
    render_text = (
        "<b>Render Cloud Deployment Steps:</b><br/>"
        "1. Push code to GitHub repository: <code>https://github.com/Karthik-543/RoadRepair.git</code><br/>"
        "2. Create a New Web Service on <b>Render.com</b> connected to your repository.<br/>"
        "3. Configure Build & Start Commands:<br/>"
        "&nbsp;&nbsp;&bull; <b>Build Command</b>: <code>npm run install:all && npm run build:frontend</code><br/>"
        "&nbsp;&nbsp;&bull; <b>Start Command</b>: <code>npm run start:backend</code><br/>"
        "4. Set Environment Variables:<br/>"
        "&nbsp;&nbsp;&bull; <code>MONGODB_URI</code> = <code>mongodb+srv://karthikgodela_db_user:karthik1234@cluster0.5gufyfa.mongodb.net/roadsense_ai</code><br/>"
        "&nbsp;&nbsp;&bull; <code>NODE_ENV</code> = <code>production</code><br/>"
        "5. Render builds the bundle, serves the frontend from Express (port 5000), and issues your live URL: <code>https://roadrepair.onrender.com</code>."
    )
    story.append(Paragraph(render_text, st['body']))

    story.append(Spacer(1, 8))
    story.append(Paragraph("4. Local Development Execution Commands", st['h1']))
    
    cmd_box = (
        "<code># Terminal 1: Backend Express Server & Static Frontend (Port 5000)</code><br/>"
        "<code>cd backend && npm start</code><br/><br/>"
        "<code># Terminal 2: Python Flask AI Service Engine (Port 5001)</code><br/>"
        "<code>cd ai-service && python app.py</code><br/><br/>"
        "<code># Local Access URL: http://localhost:5000</code><br/>"
        "<code># Live Cloud URL:  https://roadrepair.onrender.com</code>"
    )
    story.append(Paragraph(cmd_box, st['code']))

    doc.build(story, canvasmaker=NumberedCanvas)

if __name__ == '__main__':
    desktop_dir = r"C:\Users\karth_bet6yd4\Desktop\RoadRepair"
    pdf1_path = os.path.join(desktop_dir, "RoadSense_AI_Research_Paper_and_Deployment_Analysis.pdf")
    pdf2_path = os.path.join(desktop_dir, "RoadSense_AI_System_Architecture_and_DevOps_Guide.pdf")

    print(f"Generating Updated PDF 1: {pdf1_path}")
    create_research_deployment_pdf(pdf1_path)

    print(f"Generating Updated PDF 2: {pdf2_path}")
    create_devops_guide_pdf(pdf2_path)

    print("Both updated publication PDFs generated successfully on Desktop!")
