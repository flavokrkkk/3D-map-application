from pydantic import BaseModel

from backend.utils.enums import StatusTypes


class StatusModel(BaseModel):
    id: int
    name: str

class PropertyModel(BaseModel):
    name: str
    type: str
    depth: float
    status: str
    material: str
    description: str | None = None


class GlobalLayerModel(BaseModel):
    id: int
    name: str


class GeometryModel(BaseModel):
    type: str
    coordinates: list[list[float]]


class GeoObjectModel(BaseModel):
    id: int
    type: str
    properties: PropertyModel
    geometry: GeometryModel
    global_layers: list[GlobalLayerModel]
    image: str
    is_saved: bool

class UpdateGeoObjectModel(BaseModel):
    name: str | None = None
    status: int | None = None
    description: str | None = None
    material: str | None = None
    global_layers: list[int] | None = None


class GeoObjectStatistics(BaseModel):
    underground_count: int
    aboveground_count: int
    avg_depth_aboveground: float | None = None 
    avg_depth_underground: float | None = None
    materials_count: int
    active_status_count: int
    inactive_status_count: int