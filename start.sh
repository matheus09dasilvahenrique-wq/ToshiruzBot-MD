#!/bin/bash

SABTRED='\033[1;31m'
SABGREEN='\033[1;32m'
RED='\033[0;31m'
GREEN='\033[1;32m'
BLUE='\033[0;34m'
SABBLUE='\033[1;34m'
RESET='\033[0m'
ROXO='\033[1;35m'
NEG='\033[1m'

# Função para efeito de digitação
typewriter() {
    texto="$1"
    cor="$2"
    velocidade=${3:-0.05}
    for ((i=0; i<${#texto}; i++)); do
        echo -ne "${cor}${texto:$i:1}${RESET}"
        sleep $velocidade
    done
    echo ""
}

while true; do
    printf "${SABGREEN}    AUTORECONEXÃO ATIVADA PARA PREVENÇÃO DE QUEDAS!${RESET}\n"
sleep 2
    typewriter "           ⚡ Iniciando Toshiruz Bot... ⚡" "${SABBLUE}" 0.01
    node index.js

    printf "          ${SABTRED}REINICIANDO... AGUARDE UM INSTANTE!${RESET}\n"
    sleep 3
done