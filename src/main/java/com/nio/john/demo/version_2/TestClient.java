/*
 *
 * 项目名：	com.nio.john.netty
 * 文件名：	TestClient
 * 模块说明：
 * 修改历史：
 * 2018/3/26 - JOHN - 创建。
 */

package com.nio.john.demo.version_2;

/**
 * @author JOHN
 * @date 2018/3/26
 */
public class TestClient {
    public static void main(String[] args) {
        Client client = new Client("127.0.0.1", 8080);
        new Thread(client).start();
    }
}
