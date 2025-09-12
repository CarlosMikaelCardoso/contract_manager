import json
from os import environ
import logging
import requests

# Configuração do logger
logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

# URL do servidor de rollup
rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]
logger.info(f"HTTP rollup_server url is {rollup_server}")

# Armazenamento em memória para os imóveis
rentals = {}
rental_id_counter = 0

def str_to_hex(str_data):
    """Codifica uma string para o formato hexadecimal (0x...)."""
    return "0x" + str_data.encode("utf-8").hex()

def handle_advance(data):
    """Processa transações que modificam o estado (custam gás)."""
    global rental_id_counter
    logger.info(f"Received advance request data: {data}")

    try:
        payload_hex = data.get("data", {}).get("payload")
        if not payload_hex or payload_hex == "0x":
            return "accept"

        payload_str = bytes.fromhex(payload_hex[2:]).decode("utf-8")
        payload = json.loads(payload_str)
        logger.info(f"Decoded advance payload: {payload}")
        
        msg_sender = data["data"]["metadata"]["msg_sender"]
        method = payload.get("method")

        if method == "create_rental":
            rental_id_counter += 1
            rentals[rental_id_counter] = {
                "id": rental_id_counter,
                "owner": msg_sender,
                "description": payload["data"]["description"],
                "price": payload["data"]["price"],
                "rented": False,
                "rented_by": None
            }
            logger.info(f"Rental created: {rentals[rental_id_counter]}")
            notice_payload = {"method": "create_rental_success", "data": rentals[rental_id_counter]}
            requests.post(rollup_server + "/notice", json={"payload": str_to_hex(json.dumps(notice_payload))})
            return "accept"

        elif method == "alugar_imovel":
            rental_id = payload["data"]["id"]
            imovel = rentals.get(int(rental_id))
            if imovel and not imovel["rented"]:
                imovel["rented"] = True
                imovel["rented_by"] = msg_sender
                notice_payload = {"method": "aluguel_sucesso", "data": imovel}
                requests.post(rollup_server + "/notice", json={"payload": str_to_hex(json.dumps(notice_payload))})
                return "accept"
            return "reject"
        else:
            logger.warning(f"Unknown method '{method}' in advance request.")
            return "reject"

    except Exception as e:
        logger.error(f"Error processing advance request: {e}")
        return "reject"

def handle_inspect(data):
    """Processa requisições de leitura (gratuitas)."""
    logger.info(f"Received inspect request data: {data}")
    try:
        payload_hex = data.get("data", {}).get("payload", "0x")
        payload_str = bytes.fromhex(payload_hex[2:]).decode("utf-8")

        # **AQUI ESTÁ A CORREÇÃO DE ROBUSTEZ**
        # Se o payload decodificado ainda parece ser hexadecimal, decodifica de novo.
        if payload_str.startswith("0x"):
             payload_str = bytes.fromhex(payload_str[2:]).decode("utf-8")

        payload = json.loads(payload_str)
        logger.info(f"Inspect decoded payload: {payload}")

        if payload.get("method") == "listar_imoveis":
            report_payload = {"data": list(rentals.values())}
            requests.post(rollup_server + "/report", json={"payload": str_to_hex(json.dumps(report_payload))})
        
        return "accept"
    except Exception as e:
        logger.error(f"Error processing inspect request: {e}")
        return "reject"

# Mapeamento de handlers
handlers = { "advance_state": handle_advance, "inspect_state": handle_inspect }
finish = {"status": "accept"}

# Loop principal
while True:
    logger.info("Sending finish")
    response = requests.post(rollup_server + "/finish", json=finish)
    logger.info(f"Received finish status {response.status_code}")

    if response.status_code == 202:
        logger.info("No pending rollup request, trying again")
    else:
        rollup_request = response.json()
        handler = handlers.get(rollup_request["request_type"])
        if handler:
            finish["status"] = handler(rollup_request)
        else:
            finish["status"] = "reject"
