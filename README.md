# ⚡ HELIOS-LINK v3.0
**Physics-Based Space-Based Solar Power (SBSP) Engineering Simulation Platform**

![Helios-Link Banner](public/sun.jpg) *(Illustration)*

**HELIOS-LINK** has evolved from purely visual cinematic renders into a rigorous, physics-driven **aerospace engineering simulation engine**. It allows systems engineers to evaluate Space-Based Solar Power transmission using strict constraints defined by real-world geometry, aperture efficiencies, and solar constants—all visualized inside an immersive 3D holographic Mission Control environment.

---

## 🚀 Key Features

### 📐 Real-World Physics Engine (FastAPI)
- **Solar Generation**: Uses the ASTM E490 solar constant (1361 W/m²) combined with user-defined solar panel geometry and photovoltaic efficiencies to compute raw DC power.
- **Derived Antenna Models**: Removes "magic" gain numbers. Transmit (Gt) and Receive (Gr) gains are mathematically derived directly from Aperture Diameters ($D$) and Transmission Wavelength ($λ$) using the standard standard electromagnetic aperture equation: $G = η\_aperture × (πD / λ)²$.
- **Friis Transmission Link Budget**: Full implementation of Free Space Path Loss (FSPL) and pointing/atmospheric losses across GEO orbital distances (35,786 km), outputting precise Received Power (dBW) and Net System Efficiencies.

### 🛡️ Dual-Layer Validation
- **Frontend Active Bounds**: The React interface actively monitors UI parameters (such as Antenna Diameters, Panel Area, and Frequencies), providing immediate visual alerts and preventing system execution when inputs breach expected physical laws.
- **Backend Pydantic Restrictions**: The python engine strictly enforces payload validation parameters natively, neutralizing requests containing mathematically impossible efficiencies ($<15\%$ or $>35\%$), or impossible scaling geometry.

### 🪐 3D System & Transparent Diagnostics
- **Cinematic Orbit Locking**: Photorealistic earth shaders, active dynamic corona sun lighting, and a seamlessly reactive UI overlay.
- **Engineering Trace Panel**: An unmasked view giving engineers absolute transparency over the backend compute loop. Every core equation used to derive standard constants, geometry limits, loss, and linear factors.
- **Live Link Budget**: Dynamically updating transmission budget cards.

---

## 🛠️ Technology Stack

### Backend Engine
- **Framework**: Python 3.10+ / [FastAPI](https://fastapi.tiangolo.com/) ensuring type-safety.
- **Data Architecture**: Pydantic validation payload structures ensuring rigorous boundaries on variables.
- **Hosting**: Uvicorn ASGI server natively handling physics traces via asynchronous endpoints.

### Frontend Interface
- **Framework**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v3.4](https://tailwindcss.com/)
- **3D Render Environment**: [Three.js](https://threejs.org/) executed via [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) & `@react-three/drei`
- **Post-Processing**: Optical HDR Bloom via `@react-three/postprocessing`
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) functioning as the reactive bridge requesting API payload results and updating standard variables framelessly.

---

## ⚙️ Installation & Usage

### 1. Prerequisites
Ensure you have **Node.js**, **NPM**, and **Python 3.10+** installed on your workstation.

### 2. Clone the Repository
```bash
git clone https://github.com/aditya-dev-projects/Helios-link-v2.0.git
cd Helios-link-v2.0
```

### 3. Launch the Backend Physics Engine
The backend engine must be running for the frontend simulation to return computations.
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```
*(Runs securely on `localhost:8000`)*

### 4. Launch the Frontend Interface
Open a new terminal at the root of the repository.
```bash
npm install
npm run dev
```
*(Runs securely on `http://localhost:5173`)*

---

## 🎮 Controls

- **Left Click & Drag**: Rotate / Orbit Camera.
- **Right Click & Drag**: Free Pan.
- **Mouse Wheel**: Zoom dynamically.
- **Tab Swapping**: Within the right column, effortlessly swap between **Telemetry** (Live metrics + Application Logs) and **Diagnostics** (Strict physics Link Budget + Engineering Trace variables).
- **⛶ Cinematic Mode**: Located top-center. Instantly hides the diagnostic bounds and pushes the camera into an interactive fullscreen environment lock.

---

## 📁 Source Architecture

```text
/backend
├── app/
│   ├── components/        # Isolated submodules (solar.py, transmission.py, rectenna.py)
│   ├── routes/            # FastAPI Endpoint processing 
│   ├── main.py            # API Mount + Custom Validations
│   └── constants.py       # Global physics speeds and limits
/src
├── components/
│   ├── panels/            # UI Telemetry, Diagnosis, Input Panels
│   └── simulation/        # WebGL Logic (Earth, Sun, Core Beam, Orbit Tracking)
├── store/                 
│   └── simulationStore.js # Zustand REST dispatch & validation engine
├── App.jsx                
└── pages/                 
    └── Simulation.jsx     # Master 3D / Screen Interface Integrator
```

---

*Built for High-Fidelity Innovation. Designed to prove SBSP feasibility.* ⚡
