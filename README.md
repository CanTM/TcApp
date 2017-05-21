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

## Como subir o ambiente

### Banco de Dados

Executar o arquivo: MongoDB\Server\3.4\bin\mongod.exe  

A conexão com o banco pode ser feita via um novo terminal, digitando "mongo" ou através do driver java utilizado pelo backend da aplicação.

URI padrão: "mongodb://localhost:27017"

Maiores informações em: http://mongodb.github.io/mongo-java-driver/3.4/driver/

### Backend

Executar o arquivo: Apache Software Foundation\Tomcat 9.0\bin\startup.bat  

Copiar o arquivo .war para a pasta C:\Program Files\Apache Software Foundation\Tomcat 9.0\webapps.

Endereço padrão: "http://localhost:8080/"

### Frontend

A partir do diretório onde o frontend foi criado, em um terminal, digitar "ng serve".

Endereço padrão: "http://localhost:4200/"

## Workflow

1. Criar issue: #número_da_issue - nome_da_issue.  

2. Adicionar labels.  

3. Quando a issue estiver pronta para ser trabalhada, ou seja, quando não estiver bloqueada por nenhuma outra issue, mover o seu card no waffle para "ready".  

4. Para começar a trabalhar na issue, criar novo branch:    
git -branch #numero_da_issue master   
git push --set-upstream #numero_da_issue origin  
Automaticamente o card passa para "in progress".  

5. Ao finalizar a feature, fazer pull request para o master.  

## URLs Disponíveis

GET http://localhost:8080/tc-app-backend/rest/
POST http://localhost:8080/tc-app-backend/rest/login/newUser PARAMS: userName, password
GET http://localhost:8080/tc-app-backend/rest/login/autenticate PARAMS: userName, password
POST http://localhost:8080/tc-app-backend/rest/search/newSearch PARAMS: userName, searchName, trackTerms, languages
GET http://localhost:8080/tc-app-backend/rest/search/allSearches PARAMS: userName
GET http://localhost:8080/tc-app-backend/rest/search PARAMS: userName, searchName
GET http://localhost:8080/tc-app-backend/rest/search/startSearch PARAMS: userName, searchName, trackTerms, languages, timeInterval
