
import re

def parse_ufw_log_entry(log_entry):
    """
    Parses a single UFW log entry and extracts relevant information.
    """
    parsed_data = {}

    # Regex para capturar a parte inicial do log e o restante como uma string para posterior parsing
    match = re.match(r'(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}[+-]\d{2}:\d{2}) (\S+) kernel: \[UFW (\S+)\] IN=(\S+)(.*)', log_entry)

    if match:
        timestamp, hostname, action, interface_in, rest_of_log = match.groups()

        parsed_data["timestamp"] = timestamp
        parsed_data["hostname"] = hostname
        parsed_data["action"] = action
        parsed_data["interface_in"] = interface_in

        # Usar findall para extrair todos os pares chave=valor do restante do log
        key_value_pairs = re.findall(r'([A-Z]+)=([^\s]+)', rest_of_log)

        for key, value in key_value_pairs:
            # Tratar casos específicos como MAC= sem valor
            if key == 'MAC' and value == '':
                parsed_data[key.lower()] = 'N/A'
            else:
                # Tentar converter para int se for um número
                try:
                    parsed_data[key.lower()] = int(value)
                except ValueError:
                    parsed_data[key.lower()] = value

        # Lidar com campos que podem estar faltando ou ter valores específicos
        if 'out' not in parsed_data: parsed_data['out'] = 'N/A'
        if 'mac' not in parsed_data: parsed_data['mac'] = 'N/A'
        if 'flowlbl' not in parsed_data: parsed_data['flowlbl'] = 'N/A'
        if 'len' not in parsed_data: parsed_data['len_ip'] = 'N/A'; parsed_data['len_payload'] = 'N/A'
        else:
            # Se houver apenas um LEN, assumir que é len_ip e payload é N/A
            if isinstance(parsed_data['len'], int):
                parsed_data['len_ip'] = parsed_data['len']
                parsed_data['len_payload'] = 'N/A'
            del parsed_data['len'] # Remover o campo 'len' original para evitar duplicação

    else:
        parsed_data["error"] = "Could not parse log entry"
        parsed_data["original_log"] = log_entry

    return parsed_data

if __name__ == '__main__':
    # Exemplo de uso com as entradas de log fornecidas
    log_entry_1 = "2025-08-17T13:20:14.572094-03:00 ubuntu-nsh kernel: [UFW BLOCK] IN=enp0s3 OUT= MAC= SRC=fd17:625c:f037:0002:0a00:27ff:fef7:5d44 DST=ff02:0000:0000:0000:0000:0000:0000:000c LEN=655 TC=0 HOPLIMIT=1 FLOWLBL=996454 PROTO=UDP SPT=34174 DPT=3702 LEN=615"
    log_entry_2 = "2025-08-17T13:20:14.572095-03:00 ubuntu-nsh kernel: [UFW BLOCK] IN=enp0s3 OUT= MAC= SRC=fd17:625c:f037:0002:a7b2:cc74:f4c1:f0d7 DST=ff02:0000:0000:0000:0000:0000:0000:000c LEN=655 TC=0 HOPLIMIT=1 FLOWLBL=427991 PROTO=UDP SPT=60051 DPT=3702 LEN=615"

    parsed_log_1 = parse_ufw_log_entry(log_entry_1)
    parsed_log_2 = parse_ufw_log_entry(log_entry_2)

    import json
    print("\n--- Log Entry 1 ---")
    print(json.dumps(parsed_log_1, indent=4))
    print("\n--- Log Entry 2 ---")
    print(json.dumps(parsed_log_2, indent=4))

    # Exemplo de log com campos faltando (para testar a segunda regex)
    log_entry_3 = "2025-08-17T13:20:14.572095-03:00 ubuntu-nsh kernel: [UFW BLOCK] IN=enp0s3 OUT= MAC= SRC=192.168.1.1 DST=192.168.1.2 LEN=100 TC=0 HOPLIMIT=64 PROTO=TCP SPT=12345 DPT=80"
    parsed_log_3 = parse_ufw_log_entry(log_entry_3)
    print("\n--- Log Entry 3 (simpler) ---")
    print(json.dumps(parsed_log_3, indent=4))

    # Exemplo de log que não corresponde a nenhuma regex
    log_entry_4 = "This is a malformed log entry."
    parsed_log_4 = parse_ufw_log_entry(log_entry_4)
    print("\n--- Log Entry 4 (malformed) ---")
    print(json.dumps(parsed_log_4, indent=4))


