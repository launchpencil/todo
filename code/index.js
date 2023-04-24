const mysql = require('mysql2');
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  console.log(req.url)
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  const queryObject = url.parse(req.url, true).query;
  const username = queryObject.user;
  const password = queryObject.pass;

  const connection = mysql.createConnection({
    host: '192.168.0.3',
    user: username,
    password: password,
    database: 'todo'
  });

  if (req.url.startsWith('/todo/add')) {
    const taskname = queryObject.name;
    data = queryObject.date;

    
    connection.connect((err) => {
      if (err) {
        console.error('error connecting: ' + err.message);
        res.end('エラー,' + err.message);
        return;
      }
  
      const sql = "INSERT INTO ?? (name, date) VALUES (??, ?);";
      const params = [username, taskname, date];
  
      connection.query(sql, params, (err, results, fields) => {
          if (err) {
              console.error('error querying: ' + err.stack);
              res.write('エラー,' + err.message);
              return;
          }
  
          res.write('タスク：' + taskname + 'を設定しました。（締切日：' + date + '）');
  
          connection.end();
          res.end();
      });
    });

  } else {
    connection.connect((err) => {
      if (err) {
        console.error('error connecting: ' + err.message);
        res.end('エラー,' + err.message);
        return;
      }
  
      const sql = "SELECT * FROM ?? ORDER BY date ASC";
  
      connection.query(sql, [username], (err, results, fields) => {
          if (err) {
              console.error('error querying: ' + err.stack);
              res.write('エラー,' + err.message);
              return;
          }
  
          results.forEach((row) => {
            res.write(`${row.name}(${row.date}),`);
          });
  
          connection.end();
          res.end();
      });
    });
  }
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});