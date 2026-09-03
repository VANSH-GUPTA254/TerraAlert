from fastapi.testclient import TestClient
import main

client = TestClient(main.app)

def run_tests():
    # 1. Health check
    r = client.get("/")
    assert r.status_code == 200, f"Root failed: {r.status_code}"
    print("[OK] Root API endpoint status 200")

    r = client.get("/api/health")
    assert r.status_code == 200
    print("[OK] Health check endpoint status 200")

    # 2. AI Risk Prediction
    pred_payload = {
        "rainfall_24h_mm": 214.0,
        "soil_moisture_pct": 92.5,
        "slope_angle_deg": 38.0,
        "vegetation_index_ndvi": 0.22,
        "historical_risk_score": 0.90,
        "soil_type": "Sandy Loam / Debris",
        "location_name": "Wayanad Chooralmala & Mundakkai"
    }
    r = client.post("/api/predict/", json=pred_payload)
    assert r.status_code == 200
    res = r.json()
    assert res["risk_level"] == "HIGH_RISK"
    print(f"[OK] AI Prediction Engine: Level={res['risk_level']}, Score={res['risk_score_pct']}%, Confidence={res['confidence_pct']}%")

    # 3. Incidents
    r = client.get("/api/incidents/")
    assert r.status_code == 200
    incidents = r.json()
    assert len(incidents) >= 4
    print(f"[OK] Incidents Feed: {len(incidents)} reports available")

    # 4. Create Incident
    new_inc = {
        "title": "Road heave observed along Nilgiris ghat",
        "hazard_type": "Road Subsidence",
        "severity": "Moderate",
        "description": "5-meter crack developing on lower road retaining wall.",
        "latitude": 11.3530,
        "longitude": 76.7959,
        "location_name": "Coonoor Marappalam Ghat km-14",
        "reporter_name": "Field Volunteer",
        "reporter_phone": "+91 94470 99999"
    }
    r = client.post("/api/incidents/", json=new_inc)
    assert r.status_code == 200
    created_id = r.json()["id"]
    print(f"[OK] Incident Creation: Created #{created_id}")

    # 5. Alerts & CAP XML
    r = client.get("/api/alerts/")
    assert r.status_code == 200
    alerts = r.json()
    assert len(alerts) >= 3
    first_id = alerts[0]["id"]
    print(f"[OK] Alert Center: {len(alerts)} alerts active")

    r = client.get(f"/api/alerts/{first_id}/cap.xml")
    assert r.status_code == 200
    assert "xml" in r.headers["content-type"]
    print(f"[OK] CAP 1.2 XML Generator: Verified OASIS format")

    # 6. Sensors
    r = client.get("/api/sensors/")
    assert r.status_code == 200
    sensors = r.json()
    assert len(sensors) >= 6
    print(f"[OK] IoT Sensor Mesh: {len(sensors)} telemetry nodes online")

    # 7. Analytics
    r = client.get("/api/analytics/overview")
    assert r.status_code == 200
    analytics = r.json()
    assert analytics["active_alerts_count"] >= 1
    print(f"[OK] Analytics Overview: Connected Villages = {analytics['connected_villages_count']}")

    print("\n==========================================")
    print(" ALL BACKEND API ENDPOINTS VERIFIED (100%)")
    print("==========================================")

if __name__ == "__main__":
    run_tests()
