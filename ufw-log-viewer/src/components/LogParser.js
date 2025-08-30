// Função para fazer o parsing de uma entrada de log do UFW
export function parseUfwLogEntry(logEntry) {
  const parsedData = {};

  // Regex para capturar a parte inicial do log e o restante como uma string para posterior parsing
  const match = logEntry.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}[+-]\d{2}:\d{2}) (\S+) kernel: \[UFW (\S+)\] IN=(\S+)(.*)/);

  if (match) {
    const [, timestamp, hostname, action, interfaceIn, restOfLog] = match;

    parsedData.timestamp = timestamp;
    parsedData.hostname = hostname;
    parsedData.action = action;
    parsedData.interface_in = interfaceIn;

    // Usar regex para extrair todos os pares chave=valor do restante do log
    const keyValuePairs = [...restOfLog.matchAll(/([A-Z]+)=([^\s]*)/g)];

    keyValuePairs.forEach(([, key, value]) => {
      // Tratar casos específicos como MAC= sem valor
      if (key === 'MAC' && value === '') {
        parsedData[key.toLowerCase()] = 'N/A';
      } else {
        // Tentar converter para int se for um número
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && value === numValue.toString()) {
          parsedData[key.toLowerCase()] = numValue;
        } else {
          parsedData[key.toLowerCase()] = value;
        }
      }
    });

    // Lidar com campos que podem estar faltando ou ter valores específicos
    if (!parsedData.out) parsedData.out = 'N/A';
    if (!parsedData.mac) parsedData.mac = 'N/A';
    if (!parsedData.flowlbl) parsedData.flowlbl = 'N/A';
    
    // Lidar com o campo LEN que pode aparecer duas vezes
    if (parsedData.len !== undefined) {
      // Se houver apenas um LEN, assumir que é len_ip e payload é N/A
      parsedData.len_ip = parsedData.len;
      parsedData.len_payload = 'N/A';
      delete parsedData.len; // Remover o campo 'len' original para evitar duplicação
    } else {
      parsedData.len_ip = 'N/A';
      parsedData.len_payload = 'N/A';
    }

    // Renomear campos para melhor legibilidade
    if (parsedData.src) {
      parsedData.src_ip = parsedData.src;
      delete parsedData.src;
    }
    if (parsedData.dst) {
      parsedData.dst_ip = parsedData.dst;
      delete parsedData.dst;
    }
    if (parsedData.spt) {
      parsedData.src_port = parsedData.spt;
      delete parsedData.spt;
    }
    if (parsedData.dpt) {
      parsedData.dst_port = parsedData.dpt;
      delete parsedData.dpt;
    }
    if (parsedData.proto) {
      parsedData.protocol = parsedData.proto;
      delete parsedData.proto;
    }

  } else {
    parsedData.error = "Could not parse log entry";
    parsedData.original_log = logEntry;
  }

  return parsedData;
}

// Função para fazer o parsing de múltiplas entradas de log
export function parseUfwLogFile(logContent) {
  const lines = logContent.split('\n').filter(line => line.trim() !== '');
  return lines.map(line => parseUfwLogEntry(line));
}

// Função para determinar se um IP é IPv4 ou IPv6
export function getIpVersion(ip) {
  if (ip.includes(':')) {
    return 'IPv6';
  } else if (ip.includes('.')) {
    return 'IPv4';
  }
  return 'Unknown';
}

// Função para formatar timestamp para exibição
export function formatTimestamp(timestamp) {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR');
  } catch (error) {
    return timestamp;
  }
}

// Função para obter a cor baseada na ação do UFW
export function getActionColor(action) {
  switch (action.toUpperCase()) {
    case 'BLOCK':
      return 'text-red-600 bg-red-50';
    case 'ALLOW':
      return 'text-green-600 bg-green-50';
    case 'DENY':
      return 'text-orange-600 bg-orange-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

// Função para obter a cor baseada no protocolo
export function getProtocolColor(protocol) {
  switch (protocol.toUpperCase()) {
    case 'TCP':
      return 'text-blue-600 bg-blue-50';
    case 'UDP':
      return 'text-purple-600 bg-purple-50';
    case 'ICMP':
      return 'text-yellow-600 bg-yellow-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

