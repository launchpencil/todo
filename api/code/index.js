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
    let taskname = queryObject.name;
    let date = queryObject.date;

    
    connection.connect((err) => {
      if (err) {
        console.error('error connecting: ' + err.message);
        res.end('エラー,' + err.message);
        return;
      }
  
      const sql = "INSERT INTO ?? (name, date) VALUES (?, ?);";
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

  } else if(req.url.startsWith('/todo/today')) {
    connection.connect((err) => {
      if (err) {
        console.error('error connecting: ' + err.message);
        res.end('エラー,' + err.message);
        return;
      }
  
      const sql = "SELECT * FROM ?? WHERE date = CURDATE();";
  
      connection.query(sql, [username], (err, results, fields) => {
          if (err) {
              console.error('error querying: ' + err.stack);
              res.write('エラー,' + err.message);
              return;
          }
  
          results.forEach((row) => {
            res.write(`${row.name},`);
          });
  
          connection.end();
          res.end();
      });
    });
  } else if (req.url.startsWith('/todo/update')) {
    let taskname = queryObject.name;
    let newname = queryObject.newname;
    let date = queryObject.date;
    let newdate = queryObject.newdate;

    connection.connect((err) => {
      if (err) {
        console.error('error connecting: ' + err.message);
        res.end('エラー,' + err.message);
        return;
      }
  
      const sql = "UPDATE ?? SET name = ?, date = ? WHERE name = ? AND date = ?;";
  
      connection.query(sql, [username, newname, newdate, taskname, date], (err, results, fields) => {
          if (err) {
              console.error('error querying: ' + err.stack);
              res.write('エラー,' + err.message);
              return;
          }

          res.write('タスク：' + taskname + 'を更新しました。（締切日：' + newdate + '）');
          
  
          connection.end();
          res.end();
      });
    });
  } else if (req.url.startsWith('/todo/del')) {
    let taskname = queryObject.name;
    let date = queryObject.date;

    connection.connect((err) => {
      if (err) {
        console.error('error connecting: ' + err.message);
        res.end('エラー,' + err.message);
        return;
      }
  
      const sql = "UPDATE ?? SET date = '2007-04-05' WHERE name = ? AND date = ?;";
  
      connection.query(sql, [username, taskname, date], (err, results, fields) => {
          if (err) {
              console.error('error querying: ' + err.stack);
              res.write('エラー,' + err.message);
              return;
          }

          res.write('タスク：' + taskname + 'を削除しました。');
          
  
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
  
      const sql = "SELECT * FROM ?? WHERE date >= CURRENT_DATE() ORDER BY date ASC;";
  
      connection.query(sql, [username], (err, results, fields) => {
          if (err) {
              console.error('error querying: ' + err.stack);
              res.write('エラー,' + err.message);
              return;
          }
  
          results.forEach((row) => {
            res.write(`${row.name}(${formatDateWithoutYear(row.date)}),`);
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

function formatDateWithoutYear(dateString) {
  // 入力された日付のインスタンスを生成
  const date = new Date(dateString);

  // 月の配列（0-indexed）
  const months = [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月"
  ];

  // 日付、曜日、月のインデックスを取得
  const day = date.getDate();
  const dayOfWeek = date.toLocaleDateString("ja-JP", { weekday: "short" });
  const month = months[date.getMonth()];

  // 結果を返す
  return `${month}${day}(${dayOfWeek})`;
}