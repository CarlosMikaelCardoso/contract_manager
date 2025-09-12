import json
from os import environ
import logging
import requests

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]
logger.info(f"HTTP rollup_server url is {rollup_server}")

rentals = {}
rental_id_counter = 0

def str_to_hex(str_data):
    return "0x" + str_data.encode("utf-8").hex()

def handle_advance(data):
    global rental_id_counter
    logger.info(f"Received advance request data {data}")

    try:
        # Verifica se o payload existe e não está vazio
        payload_hex = data.get("data", {}).get("payload")
        if not payload_hex or payload_hex == "0x":
            logger.info("Received empty or non-existent payload, accepting.")
            return "accept"

        payload_str = bytes.fromhex(payload_hex[2:]).decode("utf-8")
        payload = json.loads(payload_str)
        logger.info(f"Decoded payload: {payload}")
        
        msg_sender = data["data"]["metadata"]["msg_sender"]

        if payload.get("method") == "create_rental":
            rental_id_counter += 1
            rentals[rental_id_counter] = {
                "id": rental_id_counter,
                "owner": msg_sender,
                "description": payload["data"]["description"],
                "price": payload["data"]["price"],
                "rented": False
            }
            logger.info(f"Rental created: {rentals[rental_id_counter]}")
            notice_payload = {"method": "create_rental", "data": rentals[rental_id_counter]}
            requests.post(rollup_server + "/notice", json={"payload": str_to_hex(json.dumps(notice_payload))})
            return "accept"

        elif payload.get("method") == "list_rentals":
            notice_payload = {"method": "list_rentals", "data": list(rentals.values())}
            requests.post(rollup_server + "/notice", json={"payload": str_to_hex(json.dumps(notice_payload))})
            return "accept"
        
        else:
            logger.warning(f"Unknown method in payload: {payload.get('method')}")
            return "reject"

    except json.JSONDecodeError:
        logger.error("Payload is not a valid JSON. Rejecting.")
        return "reject"
    except Exception as e:
        logger.error(f"Error processing advance request: {e}")
        return "reject"

def handle_inspect(data):
    logger.info(f"Received inspect request data {data}")
    return "accept"

handlers = {
    "advance_state": handle_advance,
    "inspect_state": handle_inspect,
}

finish = {"status": "accept"}

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
            logger.warning(f"Unknown request type: {rollup_request['request_type']}")
            finish["status"] = "reject"