FROM mysql:latest

COPY ./query.sql /

ENV MYSQL_USER username
ENV MYSQL_PASSWORD password

CMD [ "bash", "-c", "mysql -h 192.168.0.3 -P 3306 -u $MYSQL_USER -p$MYSQL_PASSWORD < /query.sql" ]