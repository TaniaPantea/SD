import pika
import json
import time
import uuid
import random
from datetime import datetime, timezone
import os # Import necesar pentru variabilele de mediu

# --- Configurari pentru Rulare Locala ---
# RabbitMQ ruleaza in Docker, dar portul 5672 este mapat pe localhost (127.0.0.1)
RABBITMQ_HOST = 'localhost' # Conexiunea se face pe localhost
QUEUE_NAME = 'device-measurement-queue'
INTERVAL_SECONDS = int(os.getenv('SIMULATION_INTERVAL_SEC', 6)) # 10 minute
DEVICE_ID = os.getenv('SIMULATED_DEVICE_ID', 'eb3d711f-09d1-43b1-957d-ab2f7c64af7f')

# try:
#     RABBITMQ_HOST = os.getenv('RABBITMQ_HOST', 'rabbitmq')
#     QUEUE_NAME = os.getenv('RABBITMQ_QUEUE', 'device-measurement-queue')
#     INTERVAL_SECONDS = int(os.getenv('SIMULATION_INTERVAL_SEC', 600))
#     DEVICE_ID = os.getenv('SIMULATED_DEVICE_ID', DEVICE_ID)
# except:
#     pass # Folosim valorile implicite

def connect_to_rabbitmq():
    """Stabileste conexiunea cu RabbitMQ folosind hostname-ul din Docker."""
    print(f"Connecting to RabbitMQ at {RABBITMQ_HOST}...")
    # Asteapta ca RabbitMQ sa fie gata
    while True:
        try:
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(host=RABBITMQ_HOST, port=5672, heartbeat=60))
            channel = connection.channel()
            # Asiguram ca exista coada inainte de a trimite
            channel.queue_declare(queue=QUEUE_NAME, durable=True)
            print("Successfully connected to RabbitMQ.")
            return connection, channel
        except pika.exceptions.AMQPConnectionError:
            print("RabbitMQ not ready, retrying in 5 seconds...")
            time.sleep(5)

def generate_measurement():
    """Genereaza o valoare de consum sintetica pe 10 minute."""
    
    # Simulam un consum de baza (ex: 0.1 kWh) plus o variatie aleatorie.
    base_load = 0.1 
    
    # Fluctuatia aleatorie, imitand modele (ex: intre 0.05 si 0.45 kWh)
    variation = 0.05 + (0.40 * random.random())
    
    consumption = base_load + variation
    
    # Rotunjim la 3 zecimale
    consumption = round(consumption, 3) 
    
    # Formatul de timp ISO 8601 (necesar pentru deserializarea LocalDateTime in Spring)
    now = datetime.now().isoformat()
    
    measurement = {
        "deviceId": DEVICE_ID,
        "measurementValue": consumption,
        "timestamp": now 
    }
    return measurement

def run_simulator():
    """Ruleaza bucla principala a simulatorului."""
    connection, channel = connect_to_rabbitmq()
    
    print(f"Starting simulation. Sending data every {INTERVAL_SECONDS} seconds to queue '{QUEUE_NAME}' for device {DEVICE_ID}...")

    try:
        while True:
            measurement_data = generate_measurement()
            message_body = json.dumps(measurement_data)

            channel.basic_publish(
                exchange='',
                routing_key=QUEUE_NAME, 
                body=message_body,
                properties=pika.BasicProperties(
                    delivery_mode=pika.spec.PERSISTENT_DELIVERY_MODE,
                    content_type='application/json',
                    priority=0
                )
            )

            print(f" [{datetime.now().strftime('%H:%M:%S')}] Published: {message_body}")
            time.sleep(INTERVAL_SECONDS)

    except KeyboardInterrupt:
        print("Simulator stopped by user.")
    finally:
        connection.close()

if __name__ == '__main__':
    # Asteptam ca variabilele de mediu sa fie incarcate de Docker (optional)
    time.sleep(5) 
    run_simulator()