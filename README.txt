Em DB.JS � preciso ajustar os param�tros para fazer a liga��o com o BDD

Ajustar o Dialect para o BDD que ir� utilizar

mssql � referente ao SQL Server
mysql2 � referente ao MYSQL

Ajustar os tr�s par�metros com o nome do Database, Usuario e Senha

Ap�s isso, � preciso descomentar o comando SYNC em cada MODEL para criar as tabelas
Rode a primeira vez e ap�s isso comente as mesmas linhas novamente para evitar que as tabelas sejam criadas em cima das existentes

Feito isso, preencha o database e rode o sistema tranquilamente