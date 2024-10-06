from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Config(BaseSettings):
    NETLIFY_ACCESS_KEY: str

    model_config = SettingsConfigDict(env_file=".env")


@lru_cache
def get_settings():
    return Config()
