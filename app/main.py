from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from .utils import NetlifyDomainChecker
from .config import get_settings
from . import __version__, __author__, __url__, __contact__

description: str = (
    "An app to check if a subdomain is available under https://fosscu.org"
)
app = FastAPI(
    title="fosscu subdomain checker",
    version=__version__,
    contact=dict(
        name=__author__,
        url=__url__,
        email=__contact__,
    ),
    license_info=dict(name="MIT", url="https://opensource.org/license/mit/"),
    openapi_url=None,
    docs_url=None,
    redoc_url=None,
)

origins: List[str] = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Netlify = NetlifyDomainChecker(access_token=get_settings().NETLIFY_ACCESS_KEY)


@app.get("/check-subdomain/{subdomain}", status_code=200)
async def check_subdomain(subdomain: str) -> dict[str, bool]:
    return {"is_available": Netlify.check_subdomain(subdomain, "fosscu.org")[0]}
