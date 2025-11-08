# BananaGuard

BananaGuard is an AI-powered banana disease detection and expert insights system. It combines image classification with an LLM-based Q&A system to help farmers idenity and manage banana crop diseases.

### System Architecture
- **Backend**: FastAPI service for banana leaf disease classification
- **LLM Service**: FastAPI service with RAG for expert insights
- **Frontend**: React + Vite application for user interface
- **ChromaDB**: Vector database for storing and retrieving disease knowledge

### Prerequisites
Required:
- **Docker Desktop** (latest version)
- **Ollama** (latest version)

### Hardware Requirements

#### For GPU Acceleration (Required)
- NVIDIA: RTX 3060 (Mobile or Desktop) with 4GB VRAM or better
- Apple: M4 series or later

#### Others:
- Storage: Minimum 60GB free disk space
- RAM: 16GB minimum (32GB recommended)

### Installation & Setup
1. Pre-download Ollama Models
Before running the project, ensure the required Ollama models are downloaded:
```
ollama pull gemma3:1b
ollama pull nomic-embed-text
```

2. Start the Services

From the project root directory, run:
```
docker compose -f docker-compose.yml up --build
```

**⚠️ Note**: This step will take a considerable amount of time. Ensure you have a strong, stable internet connection.

3. Initialize the Vector Database

Once the **bananaguard-llm** service is running, initialize the Chroma vector database with disease knowledge:
```
docker exec -it bananaguard-llm python -m ./src/llm/populate.py --reset
```
This command:
- Clears any existing vector database
- Loads disease reference materials
- Creates embeddings for RAG retrieval
- Populates Chroma with indexed knowledge

### Accessing the Application 

Once all services are running:

- Frontend Application: http://localhost:4173
- Backend API (Classification): http://localhost:8000/docs
- LLM API (Insights): http://localhost:8001/docs

### Troubleshooting

#### Services wont start
- Verify Docker Desktop is running
- Check that ports 4173, 8000, and 8001 are not in use
- Ensure sufficient disk space (60GB+)

#### Ollama Connection Issues
- Verify Ollama is running (ollama serve)
- Check that models are downloaded: ollama list
- For Docker on Linux, you may need to configure Ollama networking

#### Vector Database Not Initializing
- Ensure the LLM service is fully started before running the populate command
- Check logs: docker logs bananaguard-llm
- Verify internet connection for model downloads

#### Slow Performance
- GPU acceleration requires compatible hardware and proper Docker configuration
- For CPU-only systems, inference will be slower (normal)
- Ensure sufficient RAM is available


#### Development Notes
- The backend uses a pre-trained EfficientNet model for image classification
- The LLM service uses Ollama with the Gemma 3 1B model
- Vector embeddings use Nomic Embed Text model
- The frontend uses React with HeroUI and Tailwind CSS