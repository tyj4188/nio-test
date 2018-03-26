/*
 *
 * 项目名：	com.nio.john.client
 * 文件名：	ClientLaunch
 * 模块说明：
 * 修改历史：
 * 2018/3/22 - JOHN - 创建。
 */

package com.nio.john.demo.version_1;

/**
 * @author JOHN
 * @date 2018/3/22
 */
public class ClientLaunch {
    public static void main(String[] args) {
        String host = "127.0.0.1";
        String data = "土豆土豆我是地瓜";
        String publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCWvGoE6c-SEgFtUmwS6AQ4_EhWMkH0MHXdRMyOjsadN5mLSo7v_ZG19wNMSmUw6lLL_2_diX9UnlDjfWMsPkZ-X1esPjmGSceAUQInbaBQ4BqxGSWen-f6_Z_GrV935Icc2bmnQIwcxZ7XD6OuLbsU93jt5mhVHO4uWaIJNbp3pwIDAQAB";
        Client client = new Client(host, 8080, data, publicKey);
        new Thread(client, "NIO-Client-001").start();
    }
}
