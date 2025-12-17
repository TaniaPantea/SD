import pika, json, time, requests, random
from datetime import datetime

# Configurări
RABBITMQ_HOST = 'localhost'
# Portul unde rulează Device-Backend (poate fi 8081 sau portul de Gateway/Nginx)
DEVICE_API_URL = "http://localhost:8082/devices/active-ids" 
INTERVAL_SECONDS = 10 

def get_devices_to_simulate():
    try:
        # Simulatorul cere lista de ID-uri de la Backend
        response = requests.get(DEVICE_API_URL)
        if response.status_code == 200:
            return response.json() # Returnează o listă de UUID-uri
        return []
    except Exception as e:
        print(f"Error fetching devices: {e}")
        return []

def run_simulator():
    # Conectare RabbitMQ (codul tău existent...)
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
    channel = connection.channel()
    channel.queue_declare(queue='device-measurement-queue', durable=True)

    print("Simulation started. Tracking all active devices...")

    while True:
        # PASUL CHEIE: Luăm lista proaspătă de device-uri la fiecare iterație
        active_ids = get_devices_to_simulate()
        
        for d_id in active_ids:
            measurement = {
                "deviceId": d_id,
                "measurementValue": round(random.uniform(0.1, 0.5), 3),
                "timestamp": datetime.now().isoformat()
            }
            
            channel.basic_publish(
                exchange='',
                routing_key='device-measurement-queue',
                body=json.dumps(measurement),
                properties=pika.BasicProperties(content_type='application/json',delivery_mode=2,priority=0)
            )
            print(f"Sent measurement for Device: {d_id}")

        if not active_ids:
            print("No active devices found in system. Waiting...")
            
        time.sleep(INTERVAL_SECONDS)

if __name__ == '__main__':
    run_simulator()