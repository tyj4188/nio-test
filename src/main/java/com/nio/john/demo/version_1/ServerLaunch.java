/*
 *
 * 项目名：	com.nio.john.server
 * 文件名：	ServerLaunch
 * 模块说明：
 * 修改历史：
 * 2018/3/22 - JOHN - 创建。
 */

package com.nio.john.demo.version_1;

/**
 * @author JOHN
 * @date 2018/3/22
 */
public class ServerLaunch {
    public static void main(String[] args) {
        String data = "你好";
        String privateKey = "MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAJa8agTpz5ISAW1SbBLoBDj8SFYyQfQwdd1EzI6Oxp03mYtKju_9kbX3A0xKZTDqUsv_b92Jf1SeUON9Yyw-Rn5fV6w-OYZJx4BRAidtoFDgGrEZJZ6f5_r9n8atX3fkhxzZuadAjBzFntcPo64tuxT3eO3maFUc7i5Zogk1unenAgMBAAECgYBPD4f0B8aNcNA6zM5OpE8CrKAsRbP-JiTL57f61bwq3ey0-Gg8TB1O-b5LF4I3w8-lm9bKtcGJWnhGuY94tzk1YxeejyckRvbqji69UmCBLzi1Tl7ES2qKGO52XfvVAXRh9BT3QDFCZwNpI-e7V0XdjIiEamnaqmwKxvZfEJ1OUQJBAOKArHYDSIqIj29Ks1QWxPqJUBn74V93ZxWPhLnNKP31U5Iu76mEnkTT5Hw__Jdq-b14Er0AUgSBiwIIUzTGpb0CQQCqXcWB1dhbLCl1pNamyaSQm5P5ZezHvVIACk4K-FTZXLhH5HqwzwXaC3yCInHFA7vSPpLmNomvM3KCS7h73O8zAkBwYAywhFKCQNyBB9vO9XkHIAc4zQn09mWTgeAE2u_ih8vNtDG9tglb9pDewFROv4lmYmNRmA4ZJDhWatD1VzU1AkA4ziN48zC81bDNRTU9T6bLgNSKJ-4Xe4zH7qevCLZh84SOlCREqAKvfXz6dzmwE1qg87RPhofKH0FjKJRO2I_5AkBApWbaH3FVKObuXOexRyqLxsepp78t28Q6Mhr7vBbQnViaeX1Yr3fMg-rTSRK333VsaNYA9f0CK03VaXP3ua4v";
        Server server = new Server(8080, data, privateKey);
        new Thread(server, "NIO-Server-001").start();
    }
}
