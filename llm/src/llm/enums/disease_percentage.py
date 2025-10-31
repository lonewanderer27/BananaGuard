from enum import Enum

class DiseaseType(str, Enum):
    BBTV = "bbtv"
    Cordana = "cordana"
    Panama = "fusarium_wilt"
    Healthy = "healthy"
    Pestalotiopsis = "pestalotiopsis"
    BlackSigatoka = "sigatoka"

    @classmethod
    def from_str(cls, value: str):
        try:
            return cls(value)
        except ValueError:
            raise ValueError(f"'{value}' is not a valid {cls.__name__}")