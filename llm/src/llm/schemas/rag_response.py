from pydantic import BaseModel, Field
from typing import List, Optional

class RagResponse(BaseModel):
    sources: Optional[List[str]] = Field(
        default_factory=list,
        examples=[
            '/Users/Ian/Documents/Python Projects/BananaGuard/llm/data/main/diseases.md (id=/Users/adrianejamespuzon/Documents/Python Projects/BananaGuard/llm/data/main/diseases.md:0:2',
            '/Users/Ian/Documents/Python Projects/BananaGuard/llm/data/main/diseases.md (id=/Users/adrianejamespuzon/Documents/Python Projects/BananaGuard/llm/data/main/diseases.md:0:3)',
            '/Users/Ian/Documents/Python Projects/BananaGuard/llm/data/main/diseases.md (id=/Users/adrianejamespuzon/Documents/Python Projects/BananaGuard/llm/data/main/diseases.md:0:6)',
            '/Users/Ian/Documents/Python Projects/BananaGuard/llm/data/main/diseases.md (id=/Users/adrianejamespuzon/Documents/Python Projects/BananaGuard/llm/data/main/diseases.md:0:1)',
            '/Users/Ian/Documents/Python Projects/BananaGuard/llm/data/main/diseases.md (id=/Users/adrianejamespuzon/Documents/Python Projects/BananaGuard/llm/data/main/diseases.md:0:4)'
        ]
    )
    response: str = Field(
        ...,
        examples=[
            """
                *   Sanitation and virus-free planting stock
                *   Regular inspection and rogue plant removal
                *   Coordinate with nearby farms to prevent reinfection
                *   Manage aphid vectors using traps and selective insecticides
                *   Apply biocontrol agents (*Trichoderma*, *Bacillus* spp.) as part of integrated management.
            """
        ]
    )
