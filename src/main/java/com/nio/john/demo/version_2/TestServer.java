/*
 *
 * 项目名：	com.nio.john.netty
 * 文件名：	TestServer
 * 模块说明：
 * 修改历史：
 * 2018/3/26 - JOHN - 创建。
 */

package com.nio.john.demo.version_2;

/**
 * @author JOHN
 * @date 2018/3/26
 */
public class TestServer {
    public static void main(String[] args) {
        Server server = new Server();
        new Thread(server).start();
    }
}
