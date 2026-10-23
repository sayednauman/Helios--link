def calculate_rectenna(received_power_w: float, efficiency: float):
    """
    Calculate DC power derived from Rectenna array.
    P_dc = P_received * efficiency
    """
    assert 0 <= efficiency <= 1, "Rectenna efficiency must be between 0 and 1"
    assert received_power_w >= 0, "Received power must be >= 0"

    power_dc = received_power_w * efficiency
    
    trace = [
        "P_dc = P_received × η",
        f"P_dc = {received_power_w:.2e} W × {efficiency}",
        f"P_dc = {power_dc:.2e} W"
    ]
    
    return {
        "power_dc": power_dc,
        "trace": trace
    }
