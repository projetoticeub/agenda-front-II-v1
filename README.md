# Instruções para Rodar o Front-end Angular

## Pré-requisitos

Certifique-se de que você tenha os seguintes itens instalados antes de iniciar:

- **Node.js** (versão 20)
  - [Instalar Node.js](https://nodejs.org/)

- **Angular CLI**
  - Para instalar a Angular CLI globalmente, execute:
    ```bash
    npm install -g @angular/cli
    ```

## Passos para Executar

### 1. Clonar o Repositório

Se o projeto está hospedado em um repositório Git, clone o projeto com o seguinte comando:

```bash
git clone https://github.com/projetoticeub/agenda-front-II-v1.git
cd repositorio
```

### 2. Instalar Dependências
No diretório do projeto, execute o comando abaixo para instalar todas as dependências:
```bash
npm install
```

### 3. Rodar o Servidor de Desenvolvimento
Para iniciar o servidor local de desenvolvimento, execute o comando:
```bash
ng serve
```

O servidor será iniciado e o projeto estará disponível na porta 4200 por padrão.

### 4. Acessar a Aplicação
Abra o navegador e acesse:
```bash
http://localhost:4200
```

### 5. Build para Produção (Opcional)
Se desejar gerar o build otimizado para produção, execute:
```bash
ng build --prod
```

Os arquivos serão gerados na pasta dist/.




