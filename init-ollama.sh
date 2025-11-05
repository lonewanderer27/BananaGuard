#!/bin/bash

# Start Ollama in the background
/bin/ollama serve &

# Wait for Ollama to be ready
sleep 5

# Pull embeddings and llm model
ollama pull nomic-embed-text
ollama pull gemma3:1b

# Bring Ollama back to foreground
wait