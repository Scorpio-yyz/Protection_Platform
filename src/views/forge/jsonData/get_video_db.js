const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const path = require('path');
const fs = require('fs'); // 引入 fs 模块

const app = express();
const port = 3002;

// 使用 body-parser 中间件
app.use(bodyParser.json());
app.use(cors());

// 设置数据库连接
const db = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'protection_platform'
});

// 确保数据库连接可用
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to database with thread ID: ' + connection.threadId);
    connection.release();  // 释放连接回池中
});


// 获取所有样本，按 id 字段倒序排序
app.get('/video', (req, res) => {
    const query = `SELECT * FROM video ORDER BY id DESC`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching "id": ' + err);
            res.status(500).send('Error fetching "id" from database');
        } else {
            res.json(results);
            console.log("视频伪造检测数据加载成功");
        }
    });
});

// 删除指定 id 的数据
app.delete('/video/:id', async (req, res) => {
    const id = req.params.id;
    const query1 = `SELECT fileUrl,pdf_path from video where uuid = ?`;
    const query2 = `DELETE FROM video WHERE uuid = ?`;

    try {
        const [fileData] = await new Promise((resolve, reject) => {
            db.query(query1, [id], (err, result) => {
                if (err) {
                    console.error('Error fetching fileUrl and pdf_path: ' + err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        if (!fileData) {
            return res.status(404).send('File data not found');
        }

        // 删除文件
        await deleteFile(fileData.fileUrl);
        await deleteFile(fileData.pdf_path);

        // 删除数据
        db.query(query2, [id], (err, result) => {
            if (err) {
                console.error('Error deleting data: ' + err);
                res.status(500).send('Error deleting data from database');
            } else {
                console.log(`Deleted ${result.affectedRows} row(s)`);
                res.status(200).send('Data deleted successfully');
            }
        });
    } catch (err) {
        console.error('Error processing delete request: ' + err);
        res.status(500).send('Error processing delete request');
    }
});

// 删除文件的函数
const deleteFile = async (filePath) => {
    const dir_path = "../../../../public";
    try {
        if (filePath) {
            // 构建文件完整路径，确保路径正确
            // 这里根据具体的文件存储路径进行修改，确保能够正确删除文件
            const fullFilePath = path.join(dir_path, filePath);
            await fs.promises.unlink(fullFilePath); // 使用 fs.promises.unlink 方法删除文件
            console.log(`文件 ${filePath} 删除成功！`);
        }
    } catch (error) {
        console.error(`删除文件 ${filePath} 时发生错误: `, error);
    }
};

// 监听端口
app.listen(port, () => {
    console.log(`get_video_db running on port ${port}`);
});
