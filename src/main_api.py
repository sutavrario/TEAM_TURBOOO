from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
import requests
import uvicorn

app = FastAPI(title="VocalGuard Secure Backend")
security = HTTPBearer()

# Your specific Auth0 credentials!
AUTH0_DOMAIN = "vocalguard-dev.us.auth0.com"
API_AUDIENCE = "https://vocalguard-api"
ALGORITHMS = ["RS256"]

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """This is the 'Bouncer'. It checks the Auth0 wristband."""
    token = credentials.credentials
    try:
        # Fetch the public keys from your Auth0 account
        jwks_url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
        jwks = requests.get(jwks_url).json()
        
        # Verify the token is real and hasn't been tampered with
        payload = jwt.decode(
            token,
            jwks,
            algorithms=ALGORITHMS,
            audience=API_AUDIENCE,
            issuer=f"https://{AUTH0_DOMAIN}/"
        )
        return payload # Returns the singer's secure ID!
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Authentication: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

# ==========================================
# 🚀 SECURE API ROUTES
# ==========================================

@app.get("/")
def public_route():
    return {"message": "VocalGuard API is running! But you need a token to see data."}

@app.post("/api/biometrics")
def receive_live_data(hr: int, spo2: int, strain: float, user: dict = Depends(verify_token)):
    """
    Because of 'Depends(verify_token)', NO ONE can access this route 
    unless they have a valid Auth0 login token!
    """
    user_id = user.get("sub") # The unique ID of the singer who is logged in
    
    print(f"🔒 Secure Data Received from Singer: {user_id}")
    print(f"❤️ Heart Rate: {hr}, SpO2: {spo2}, Strain: {strain}")
    
    # Later, we will plug the Random Forest AI model right here!
    
    return {"status": "success", "message": "Biometrics securely logged", "singer_id": user_id}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
