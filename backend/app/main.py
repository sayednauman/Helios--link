from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from app.routes.simulation import router as simulation_router

app = FastAPI(title="Helios-Link V3.0 Physics API")

# Allow all origins for dev simplicity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(simulation_router, prefix="/api")

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    # format a simple user-friendly string from the first error
    if errors:
        field = ".".join(str(loc) for loc in errors[0].get("loc", [])[1:])
        msg = errors[0].get("msg", "")
        message = f"Invalid value for {field}: {msg}"
    else:
        message = "Validation failed"
        
    return JSONResponse(
        status_code=422,
        content={"status": "error", "message": message}
    )

@app.get("/")
def read_root():
    return {"message": "Helios-Link Physics Engine Active."}
