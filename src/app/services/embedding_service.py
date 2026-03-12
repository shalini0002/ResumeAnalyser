import os
import numpy as np 
from dotenv import load_dotenv

load_dotenv()

# Mock embedding service for development
def get_embedding(text: str):
    # Return a mock embedding vector (768 dimensions like many embedding models)
    np.random.seed(hash(text) % 1000)  # Consistent seed for same text
    return np.random.rand(768).tolist()

def cosine_similarity(vec1, vec2):
    vec1 = np.array(vec1)
    vec2 = np.array(vec2)

    return float(np.dot(vec1, vec2)/(np.linalg.norm(vec1) * np.linalg.norm(vec2)))