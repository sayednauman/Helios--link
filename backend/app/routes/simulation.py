from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.components.solar import calculate_solar_power
from app.components.transmission import calculate_transmission
from app.components.rectenna import calculate_rectenna

router = APIRouter()

class SimulationRequest(BaseModel):
    area_m2: float = Field(..., ge=1000, le=200000, description="Solar panel area in m2")
    solar_efficiency: float = Field(..., ge=0.15, le=0.35, description="Efficiency of solar panels")
    frequency_ghz: float = Field(..., ge=1, le=10, description="Transmission frequency in GHz")
    distance_km: float = Field(..., gt=0, description="Distance in km")
    tx_diameter_m: float = Field(..., ge=10, le=1000, description="Tx antenna diameter in m")
    rx_diameter_m: float = Field(..., ge=50, le=5000, description="Rx antenna diameter in m")
    rectenna_efficiency: float = Field(..., ge=0.70, le=0.90, description="Rectenna conversion efficiency")

@router.post("/simulate")
async def simulate(req: SimulationRequest):
    try:
        # Convert API natural units to strict SI
        freq_hz = req.frequency_ghz * 1e9
        dist_m = req.distance_km * 1000.0

        # Run Solar Model
        solar_result = calculate_solar_power(
            area_m2=req.area_m2, 
            efficiency=req.solar_efficiency
        )

        # Run Transmission Model
        trans_result = calculate_transmission(
            tx_power_w=solar_result["power_watts"],
            distance_m=dist_m,
            frequency_hz=freq_hz,
            tx_diameter_m=req.tx_diameter_m,
            rx_diameter_m=req.rx_diameter_m
        )

        # Run Rectenna Model
        rect_result = calculate_rectenna(
            received_power_w=trans_result["rx_power_w"],
            efficiency=req.rectenna_efficiency
        )
        
        # Build strict response structure
        return {
            "solar": solar_result,
            "transmission": trans_result,
            "rectenna": rect_result,
            "summary": {
                "power_generated_w": solar_result["power_watts"],
                "received_power_w": trans_result["rx_power_w"],
                "final_power_dc_w": rect_result["power_dc"],
                "overall_efficiency": (rect_result["power_dc"] / solar_result["power_watts"]) if solar_result["power_watts"] > 0 else 0
            },
            "assumptions": [
                "GEO Orbit Assumed (Distances ~35,786 km)",
                "Solar Constant: 1361 W/m² (ASTM E490)",
                "RF Model: Friis Transmission Equation",
                "Atmospheric / Pointing Losses: 2.0 dB assumed fixed",
                "Antenna Model: High-gain phased array (large aperture assumed)",
                "Antenna gains are calculated from aperture size using standard electromagnetic relations"
            ],
            "limitations": [
                "Ideal beam alignment assumed",
                "No atmospheric turbulence modeling",
                "No hardware inefficiencies beyond defined losses",
                "No orbital perturbations"
            ]
        }
    except AssertionError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation error: {str(e)}")
