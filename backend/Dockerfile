# ================================================
# Backend Dockerfile — FastAPI + WeasyPrint
# ================================================
# WeasyPrint needs system-level libraries (Pango, Cairo, GDK-Pixbuf)
# which aren't available via pip — they must be installed via apt.

FROM python:3.12-slim

# ---- System Dependencies for WeasyPrint ----
RUN apt-get update && apt-get install -y --no-install-recommends \
    # WeasyPrint core deps
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libpangoft2-1.0-0 \
    libcairo2 \
    libgdk-pixbuf-2.0-0 \
    libffi-dev \
    libglib2.0-0 \
    shared-mime-info \
    # Fonts (so PDF text renders properly)
    fonts-noto \
    fonts-noto-cjk \
    # Clean up apt cache to keep image small
    && rm -rf /var/lib/apt/lists/*

# ---- Working Directory ----
WORKDIR /app

# ---- Install Python Dependencies ----
# Copy requirements first (Docker caches this layer if requirements don't change)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ---- Copy Application Code ----
COPY . .

# ---- Create reports directory ----
RUN mkdir -p /app/reports

# ---- Expose Port ----
EXPOSE 8000

# ---- Run Server ----
# --host 0.0.0.0 makes it accessible from outside the container
# --workers 1 for now (can increase for production)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
