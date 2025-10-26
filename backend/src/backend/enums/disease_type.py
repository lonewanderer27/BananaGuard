from enum import Enum

class DiseaseType(str, Enum):
    BlackSigatoka = "sigatoka"
    BBTV = "bbtv"
    Panama = "fusarium_wilt"
    Healthy = "healthy"
    Cordana = "cordana"
    Pestalotiopsis = "pestalotiopsis"
