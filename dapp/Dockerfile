# syntax=docker.io/docker/dockerfile:1
# Usa a imagem base oficial do Python para a arquitetura da Cartesi Machine
FROM --platform=linux/riscv64 cartesi/python:3.10-slim-jammy

# Instala as ferramentas da Cartesi em uma única camada para otimizar o cache
ARG MACHINE_EMULATOR_TOOLS_VERSION=0.14.1
ADD https://github.com/cartesi/machine-emulator-tools/releases/download/v${MACHINE_EMULATOR_TOOLS_VERSION}/machine-emulator-tools-v${MACHINE_EMULATOR_TOOLS_VERSION}.deb /
RUN dpkg -i /machine-emulator-tools-v${MACHINE_EMULATOR_TOOLS_VERSION}.deb \
  && rm /machine-emulator-tools-v${MACHINE_EMULATOR_TOOLS_VERSION}.deb

# Define metadados para a máquina Cartesi
LABEL io.cartesi.rollups.sdk_version=0.9.0
LABEL io.cartesi.rollups.ram_size=128Mi

# Instala o busybox (utilitário de sistema) e limpa o cache do apt em uma única camada
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
    busybox-static=1:1.30.1-7ubuntu3 && \
    rm -rf /var/lib/apt/lists/*

# Cria um usuário não-root 'dapp' para rodar a aplicação (boa prática de segurança)
RUN useradd --create-home --user-group dapp
USER dapp

# Define o diretório de trabalho
WORKDIR /opt/cartesi/dapp

# Copia e instala as dependências (apenas 'requests')
COPY --chown=dapp:dapp ./requirements.txt .
RUN pip install --user -r requirements.txt

# Copia o código da aplicação
COPY --chown=dapp:dapp . .

# Define a variável de ambiente para o servidor de rollup
ENV ROLLUP_HTTP_SERVER_URL="http://127.0.0.1:5004"

# Define o ponto de entrada e o comando para rodar a aplicação
ENTRYPOINT ["rollup-init"]
CMD ["python3", "-u", "dapp.py"]