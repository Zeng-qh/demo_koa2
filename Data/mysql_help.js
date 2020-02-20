const mysql = require('mysql')
const mysql_config = require('../config/config.json').mysql

// connection.connect((err, result) => {
//   if (err) {
//     console.log(err);
//     console.log("连接失败");
//     return;
//   }
//   console.log(result);
//   console.log("连接成功");
// });
let db_v1 = (sql, addSqlParams, callback) => {
    let connection = mysql.createConnection(mysql_config);
    connection.connect()

    connection.query(sql, addSqlParams, (err, data) => {
        console.dir(err);
        console.dir(data);
        callback && callback(err, data)
    })
    connection.end(); // 结束连接
}
let db = (sql, addSqlParams) => {
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(mysql_config);
        connection.connect()
        connection.query(sql, addSqlParams, (err, data) => {
            if (err) { reject(err) }
            else {
                resolve(data)
            }
        })
        connection.end(); // 结束连接
    })
}


let pool = mysql.createPool(mysql_config);

let query = (sql, addSqlParams) => {//返回promise 对象
    return new Promise((resolve, reject) => {
        pool.getConnection((err, con) => {// 连接
            if (err) {
                reject(err)
            } else {
                con.query(sql, addSqlParams, (err, data) => {//执行
                    if (err) {
                        reject(err)
                    } else {
                        resolve(data)
                    }
                    con.release()
                })
            }
        })
    })
}

// module.exports = { db:db } 相当于
// module.exports = { db }

module.exports = { db, query, db_v1 }
