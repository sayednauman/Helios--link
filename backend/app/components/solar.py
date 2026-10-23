from app.constants import SOLAR_CONSTANT

def calculate_solar_power(area_m2: float, efficiency: float, degradation: float = 0.95):
    """
    Calculate solar power generation.
    P = I * A * eff * degradation
    """
    assert 0 <= efficiency <= 1, "Efficiency must be between 0 and 1"
    assert 0 <= degradation <= 1, "Degradation must be between 0 and 1"
    assert area_m2 > 0, "Area must be > 0"

    power_watts = SOLAR_CONSTANT * area_m2 * efficiency * degradation
    
    trace = [
        "P = I × A × η × degradation",
        f"P = {SOLAR_CONSTANT} W/m² × {area_m2} m² × {efficiency} × {degradation}",
        f"P = {power_watts:.2f} W"
    ]
    
    return {
        "power_watts": power_watts,
        "trace": trace
    }
