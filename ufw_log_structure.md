## Estrutura do Log do UFW

Com base na imagem do log fornecida, os seguintes campos foram identificados:

- **Timestamp**: `YYYY-MM-DDTHH:MM:SS.microseconds-timezone` (Ex: `2025-08-17T13:20:14.572094-03:00`)
- **Hostname**: Nome do host onde o log foi gerado (Ex: `ubuntu-nsh`)
- **Componente**: Geralmente `kernel:`
- **Ação do UFW**: Indica a ação tomada pelo UFW (Ex: `[UFW BLOCK]`)
- **IN**: Interface de rede de entrada (Ex: `enp0s3`)
- **OUT**: Interface de rede de saída (pode estar vazio)
- **MAC**: Endereço MAC (pode estar vazio)
- **SRC**: Endereço IP de origem (IPv4 ou IPv6) (Ex: `fd17:625c:f037:0002:0a00:27ff:fef7:5d44`)
- **DST**: Endereço IP de destino (IPv4 ou IPv6) (Ex: `ff02:0000:0000:0000:0000:0000:0000:000c`)
- **LEN**: Comprimento do pacote (aparece duas vezes, uma para o pacote IP e outra para o datagrama UDP/TCP)
- **TC**: Traffic Class (Ex: `0`)
- **HOPLIMIT**: Limite de saltos (para IPv6) ou TTL (para IPv4) (Ex: `1`)
- **FLOWLBL**: Flow Label (para IPv6) (Ex: `996454`)
- **PROTO**: Protocolo (Ex: `UDP`)
- **SPT**: Porta de origem (Ex: `34174`)
- **DPT**: Porta de destino (Ex: `3702`)

**Observações:**
- Alguns campos podem estar vazios dependendo do tipo de evento.
- O campo `LEN` aparece duas vezes, indicando provavelmente o comprimento total do pacote IP e o comprimento do payload (datagrama UDP/TCP).
- Os endereços IP podem ser IPv4 ou IPv6.

Esta estrutura será usada como base para o parsing dos logs.

