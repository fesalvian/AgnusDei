import redis
import json
from dotenv import load_dotenv
import os
from mysql.connector import pooling
from redis.exceptions import ConnectionError

# Carrega as variáveis do arquivo .env
load_dotenv()

# Configuração do banco MySQL
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

# Usa a URL única
cache = redis.StrictRedis.from_url(
    os.getenv("REDIS_URL"), 
    decode_responses=True
)

# Criando um pool de conexões com MySQL
pool = pooling.MySQLConnectionPool(
    pool_name="mypool",
    pool_size=5,  # Número máximo de conexões simultâneas
    host=DB_HOST,
    port=DB_PORT,
    database=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD
)

def get_connection():
    """Obtém uma conexão do pool de conexões do MySQL"""
    try:
        return pool.get_connection()
    except Exception as e:
        print(f"Erro ao obter conexão do pool: {e}")
        return None

def get_cached_data(key):
    """Busca dados no Redis (se existirem)"""
    cached_data = cache.get(key)
    if cached_data:
        print(f"🔹 Usando cache para {key}")
        return json.loads(cached_data)
    return None

def set_cache_data(key, data, expiration=3600):
    """Armazena dados no Redis com tempo de expiração (1 hora)"""
    cache.setex(key, expiration, json.dumps(data))
    print(f"✅ Dados armazenados no cache para {key}")

def get_cached_data(key):
    """Busca dados no Redis com fallback silencioso"""
    try:
        if cached := cache.get(key):
            print(f"✅ Cache encontrado para {key}")
            return json.loads(cached)
    except ConnectionError:
        print("⚠️ Redis offline - Ignorando cache")
    return None

def set_cache_data(key, data, expiration=3600):
    """Armazena dados no Redis com fallback silencioso"""
    try:
        cache.setex(key, expiration, json.dumps(data))
        print(f"✅ Dados salvos no cache: {key}")
    except ConnectionError:
        print("⚠️ Redis offline - Não foi possível salvar no cache")
   
