Em DB.JS é preciso ajustar os paramêtros para fazer a ligação com o BDD

Ajustar o Dialect para o BDD que irá utilizar

mssql é referente ao SQL Server
mysql2 é referente ao MYSQL

Ajustar os três parâmetros com o nome do Database, Usuario e Senha

Após isso, é preciso descomentar o comando SYNC em cada MODEL para criar as tabelas
Rode a primeira vez e após isso comente as mesmas linhas novamente para evitar que as tabelas sejam criadas em cima das existentes

Feito isso, preencha o database e rode o sistema tranquilamente