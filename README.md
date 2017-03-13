# TcApp

## Requisitos para Ambiente de Desenvolvimento

### Banco de Dados

MongoDB 3.4.2 (https://www.mongodb.com/)  

### Backend

Tomcat 9.0.0 (https://tomcat.apache.org/download-90.cgi)  
Java sdk 8u121 (http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)  
Maven 3.3.9 (https://maven.apache.org/)  

### Frontend

NodeJS 6.10.0LTS (https://nodejs.org/en/)  
Typescript (instalar via npm)  
Angular-cli (instalar via npm)  

### Versionamento

Git (https://git-scm.com/)  
Gitflow (https://datasift.github.io/gitflow/IntroducingGitFlow.html)  

### Board

Waffle (https://waffle.io/CanTM/TcApp)  

### Deploy

Heroku (https://www.heroku.com/)

## Como subir o ambiente

### Banco de Dados

Executar o arquivo: MongoDB\Server\3.4\bin\mongod.exe  

A conexão com o banco pode ser feita via um novo terminal, digitando "mongo" ou através do driver java utilizado pelo backend da aplicação.

### Backend

Executar o arquivo: Apache Software Foundation\Tomcat 9.0\bin\startup.bat  

Copiar o arquivo .war para a pasta C:\Program Files\Apache Software Foundation\Tomcat 9.0\webapps.

### Frontend

A partir do diretório onde o frontend foi criado, em um terminal, digitar "ng serve".
